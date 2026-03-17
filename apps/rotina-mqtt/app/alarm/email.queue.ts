import "dotenv/config";
import { withDb as Connection } from "@/lib/connection";
import { timestamp } from "@/lib/utils";
import { GET_COMPANIES, GET_EMPLOYEE_EMAILS, GET_GENERATORS_BY_COMPANY, GET_GLOBAL_EMAILS, INSERT_QUEUE } from "./email.queries";

type RecipientRow = {
	RecipientEmail: string;
	AlarmID: number;
	AlarmMessage: string;
};

type GlobalEmailRow = {
	Email: string;
};

type QueueOptions = {
	includeEmployees?: boolean;
	includeGlobal?: boolean;
};

export async function updateAlarmEmailQueue(
	options: QueueOptions = {}
): Promise<void> {
	const includeEmployees = options.includeEmployees ?? true;
	const includeGlobal = options.includeGlobal ?? true;

	console.log(`➡️ [${timestamp()}] Starting alarm queue update`);

	await Connection(async (pool) => {
		// 0) Global accounts (always receive alarm emails)
		let globalEmails: string[] = [];

		if (includeGlobal) {
			const queryResult = await pool.request().query(GET_GLOBAL_EMAILS);
			globalEmails = queryResult.recordset.map((r: GlobalEmailRow) => r.Email).filter(Boolean);
		}

		// 1. Get companies
		const companies = await pool.request().query(GET_COMPANIES);

		for (const company of companies.recordset) {
			const companyID = company.ClientCompanyID;

			// 2) Employee emails
			let employeeEmails: string[] = [];

			if (includeEmployees) {
				const queryResult = await pool
					.request()
					.input("companyID", companyID)
					.query(GET_EMPLOYEE_EMAILS);

				employeeEmails = queryResult.recordset
					.map((r: any) => r.EmployeeEmail)
					.filter(Boolean);
			}

			// 3. Generator IDs
			const generatorsResult = await pool
				.request()
				.input("companyID", companyID)
				.query(GET_GENERATORS_BY_COMPANY);

			if (!generatorsResult.recordset.length) continue;

			const generatorIds = generatorsResult.recordset.map((g: any) => g.GeneratorID);
			const generatorIdsParam = generatorIds.join(",");

			// 4. Alarms (last 30 days, active)
			const alarmsResult = await pool.request().query(`
				SELECT AlarmID, Message
				FROM Modbus.Alarm
				WHERE GeneratorID IN (${generatorIdsParam})
				AND [Exit] IS NULL
				AND DateTime >= DATEADD(HOUR, -720, GETDATE())
			`);

			if (!alarmsResult.recordset.length) { continue; }

			// 5) Merge recipients depending on mode
			const allRecipients = Array.from(
				new Set([...employeeEmails, ...globalEmails])
			);

			if (!allRecipients.length) { continue; }

			const recipients: RecipientRow[] = [];

			for (const email of allRecipients) {
				for (const alarm of alarmsResult.recordset) {
					recipients.push({
						RecipientEmail: email,
						AlarmID: alarm.AlarmID,
						AlarmMessage: alarm.Message,
					});
				}
			}

			console.log(`🟧 Company ID ${companyID}: Found ${alarmsResult.recordset.length} active alarms. Processing ${recipients.length} email jobs...`);

			// 6. Insert queue (ignore duplicates)
			for (const r of recipients) {
				try {
					await pool
						.request()
						.input("email", r.RecipientEmail)
						.input("alarmID", r.AlarmID)
						.input("msg", r.AlarmMessage)
						.query(INSERT_QUEUE);
				} catch (err) { /* Ignore duplicates/do nothing */ }
			}
		}
	});

	console.log(`[${timestamp()}] Alarm queue update finished.`);
}