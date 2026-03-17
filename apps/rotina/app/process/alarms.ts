import sql from "mssql";
import { withDb as Connection } from "@/lib/connection";

type LookupTable = Record<number, string>;
type DecodeType = "fault_register" | "fault_register_ext";

const FAULT_REGISTER: LookupTable = {
	15: "Low Fuel Level",
	14: "Low Coolant Level",
	13: "Overspeed",
	12: "Low Oil Pressure",
	11: "Pre-Low Oil Pressure",
	10: "High Engine Temperature",
	9: "Pre-High Engine Temperature",
	8: "Low Coolant Temperature",
	7: "Fail to Start",
	6: "Charger AC Failure",
	5: "Low Battery Voltage",
	4: "High Battery Voltage",
	3: "Not In Auto",
	2: "Genset Running",
	1: "Genset Supplying Load",
	0: "Common Alarm",
};

const FAULT_REGISTER_EXT: LookupTable = {
	31: "Emergency Stop",
	30: "Utility Circuit Breaker Tripped",
	29: "Genset Circuit Breaker Tripped",
	28: "Load Demand",
	27: "Fail to Close",
	26: "Fail to Sync",
	25: "Reverse kVAr",
	24: "Reverse kW",
	23: "Short Circuit",
	22: "Overcurrent",
	21: "Overload",
	20: "Under Frequency",
	19: "Low AC Voltage",
	18: "High AC Voltage",
	17: "Ground Fault",
	16: "Check Genset",
};

export function decodeBits(input: string, type: DecodeType): Record<number, string> {
	const result: Record<number, string> = {};

	if (!/^[01]+$/.test(input)) {
		return result;
	}

	let lookup: LookupTable;
	let start: number;
	let limit: number;
	let padLength: number;

	switch (type) {
		case "fault_register":
			lookup = FAULT_REGISTER;
			start = 0;
			limit = 15;
			padLength = 16;
			break;

		case "fault_register_ext":
			lookup = FAULT_REGISTER_EXT;
			start = 16;
			limit = 31;
			padLength = 32;
			break;

		default:
			return result;
	}

	const padded = input.padStart(padLength, "0");

	for (let i = limit; i >= start; i--) {
		if (padded[i] === "1") {
			const label = lookup[i];
			if (label !== undefined) {
				result[i] = label;
			}
		}
	}

	// Temporary debug result
	// return {
	// 	'0': 'Common Alarm',
	// 	'3': 'Not In Auto',
	// 	'4': 'High Battery Voltage',
	// 	'31': 'Emergency Stop',
	// }

	return result;
}

/*-----------------------------------------------------------------------------*/
/* 🚨 Alarms Routine
/*-----------------------------------------------------------------------------*/

const alarmLocks = new Map<number, Promise<void>>();

export async function alarmLock(generatorID: number, fn: () => Promise<void>) {
	const prev = alarmLocks.get(generatorID) ?? Promise.resolve();
	let release!: () => void;

	const next = new Promise<void>((r) => (release = r));
	alarmLocks.set(
		generatorID,
		prev.then(() => next),
	);

	await prev;
	try {
		await fn();
	} finally {
		release();
		if (alarmLocks.get(generatorID) === next) {
			alarmLocks.delete(generatorID);
		}
	}
}


export async function alarmsRoutine(generatorID: number, alarmData: Record<string, string>, dateTime: string) {
	// console.log(alarmData);
	const { fault_register, fault_register_extended } = alarmData;
	
	if (!fault_register || !fault_register_extended) {
		console.error(`❎ Alarm data missing for GeneratorID: ${generatorID} at ${dateTime}`);
		return;
	}

	/* Merge without changing the keys */
	const alarms: Record<number, string> = {
		...decodeBits(fault_register, "fault_register"),
		...decodeBits(fault_register_extended, "fault_register_ext"),
	};

	// console.log("Decoded Alarms:", alarms);

	/* Load previous alarms (Code => Message) */
	const previousAlarms = await selectPreviousAlarms(generatorID);

	// console.log("Previous Alarms:", previousAlarms);

	const alarmsLength = Object.keys(alarms).length;
	const previousAlarmsLength = Object.keys(previousAlarms).length;

	/* If both arrays are empty, there is nothing to update */
	if (alarmsLength === 0 && previousAlarmsLength === 0) { return; }

	/* Case 1: no previous alarms, insert all */
	if (previousAlarmsLength === 0 && alarmsLength > 0) {
		for (const [code, message] of Object.entries(alarms)) {
			await insertAlarm({
				generatorID,
				datetime: dateTime,
				code: Number(code),
				message: message,
			});
		}
	}

	/* Case 2: new alarms (present now, absent before) */
	if (previousAlarmsLength > 0 && alarmsLength > 0) {
		for (const [code, message] of Object.entries(alarms)) {
			if (!(code in previousAlarms)) {
				await insertAlarm({
					generatorID,
					datetime: dateTime,
					code: Number(code),
					message: message,
				});
			}
		}
	}

	/* Case 3: alarms that exited (present before, absent now) */
	for (const [code] of Object.entries(previousAlarms)) {
		if (!(code in alarms)) {
			await feedbackAlarms(Number(code), generatorID, dateTime);

			await updateAlarmExit({
				generatorID,
				code: Number(code),
				exit: dateTime,
			});
		}
	}
}

/*-----------------------------------------------------------------------------*/
/* 🗃️ Database Functions
/*-----------------------------------------------------------------------------*/

async function selectPreviousAlarms(generatorID: number): Promise<Record<number, string>> {
	try {
		const query = `SELECT Code, Message FROM Modbus.Alarm 
		WHERE GeneratorID = @GeneratorID AND [Exit] IS NULL`;

		return await Connection(async (pool) => {
			const result = await pool
				.request()
				.input("GeneratorID", sql.Int, generatorID)
				.query(query);
			const alarms: Record<number, string> = {};

			for (const row of result.recordset) {
				alarms[row.Code] = row.Message;
			}

			return alarms;
		});
		
	} catch (error) {
		console.error("❌ DB selectPreviousAlarms error:", error);
		return {};
	}
}

async function insertAlarm(params: { generatorID: number; datetime: string; code: number; message: string; }): Promise<void> {
	try {
		const query = `INSERT INTO Modbus.Alarm (GeneratorID, DateTime, Entrance, Code, Message)
		VALUES (@GeneratorID, @DateTime, @DateTime, @Code, @Message)`;

		return await Connection(async (pool) => {
			await pool
				.request()
				.input("GeneratorID", sql.Int, params.generatorID)
				.input("DateTime", sql.DateTime, new Date(params.datetime + "Z"))
				.input("Entrance", sql.DateTime, new Date(params.datetime + "Z"))
				.input("Code", sql.Int, params.code)
				.input("Message", sql.VarChar(99), params.message)
				.query(query);
		});
	} catch (error) {
		console.error("❌ DB insertAlarm error:", error);
	}
}

async function updateAlarmExit(params: {generatorID: number; code: number; exit: string;}): Promise<void> {
	try {
		const query = `UPDATE Modbus.Alarm
		SET [Exit] = @Exit WHERE GeneratorID = @GeneratorID AND Code = @Code AND [Exit] IS NULL`;

		return await Connection(async (pool) => {
			await pool
				.request()
				.input("GeneratorID", sql.Int, params.generatorID)
				.input("Code", sql.Int, params.code)
				.input("Exit", sql.DateTime, new Date(params.exit + "Z"))
				.query(query);
		});
		
	} catch (error) {
		console.error("❌ DB updateAlarmExit error:", error);
	}
}

async function feedbackAlarms(code: number, generatorID: number, dateTime: string): Promise<void> {
	let insert = "";

	switch (code) {
		case 2:
			// (Bit Value 1) Genset Running -> Genset Stopped (Bit Value 0)
			insert = `INSERT INTO Modbus.Alarm (GeneratorID, DateTime, Entrance, Code, Message)
			VALUES (@GeneratorID, @dateTime, @dateTime, 100, 'Gerador Parado')`;
			break;
		case 3:
			// (Bit Value 1) Not In Auto -> In Auto (Bit Value 0)
			insert = `INSERT INTO Modbus.Alarm (GeneratorID, DateTime, Entrance, Code, Message)
			VALUES (@GeneratorID, @DateTime, @DateTime, 101, 'Está em Automático')`;
			break;
		default: return;
	}

	try {
		return await Connection(async (pool) => {
			await pool
				.request()
				.input("GeneratorID", sql.Int, generatorID)
				.input("DateTime", sql.DateTime, new Date(dateTime + "Z"))
				.input("Entrance", sql.DateTime, new Date(dateTime + "Z"))
				.query(insert);
		});
	} catch (error) {
		console.error("❌ DB feedbackAlarms error:", error);
	}
}

/*-----------------------------------------------------------------------------*/
/* 📝 Old Comments
/*-----------------------------------------------------------------------------*/

/* (Old Comment) Case 1: When previousAlarms is empty and alarms is not empty, insert all new alarms */

/* (Old Comment) Case 2: When previousAlarms and alarms are not empty, validate before inserting 
 * new alarms. Each value that is present on $alarms, that is not present on $previousAlarms 
 * represents a new alarm; */

/* (Old Comment) Case 3: Since $previousAlarms was not empty, validate if there are any alarms in 
 * need of updating the exit stauts, each value that is present on $previousAlarms, that is not 
 * present on $alarms, represents an alarm that needs to be updated; */