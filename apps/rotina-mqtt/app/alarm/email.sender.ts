import "dotenv/config";
import { withDb as Connection } from "../../lib/connection";
import sql from "mssql";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

type AlarmEmailInfo = {
	ALARMID: number;
	CLIENTCOMPANYID: number;
	GENERATORID: number;
	COMPANYNAME: string;
	GENERATORNAME: string;
	SERIALNUMBER: string;
	ADDRESS: string;
	ENTRANCE: string | Date;
	CODE: number;
	MESSAGE: string;
	MODELNAME: string;
	STATUS: string;
	DEVICETYPE: string;
};

type EmailListRow = {
	EmailListID: number;
	RecipientEmail: string;
	AlarmID: number;
	AlarmMessage: string;
};

type AlarmStyle = {
	classification: string;
	color: string;
};

function logMessage(message: string, using: string) {
	let timestamp = new Date().toLocaleString("pt-BR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});

	timestamp = timestamp.replace(",", "");

	console.log(`%c ✅ [${timestamp}] ${message} (${using})`, "color: green;");
}

function logError(message: string, using: string, err?: unknown) {
	let timestamp = new Date().toLocaleString("pt-BR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});

	timestamp = timestamp.replace(",", "");

	console.log(`%c ❌ [${timestamp}] ${message} (${using})`, "color: red;", err ?? "");
}

function formatDateBr(date: Date): string {
	const dd = String(date.getDate()).padStart(2, "0");
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const yy = String(date.getFullYear()).slice(-2);
	const hh = String(date.getHours()).padStart(2, "0");
	const mi = String(date.getMinutes()).padStart(2, "0");
	const ss = String(date.getSeconds()).padStart(2, "0");
	return `${dd}/${mm}/${yy} - ${hh}:${mi}:${ss}`;
}

async function fetchGroupName(generatorId: number): Promise<string> {
	return Connection(async (pool) => {
		const result = await pool
			.request()
			.input("GeneratorID", sql.Int, generatorId)
			.query(`
        SELECT TOP (1)
          G.GroupName
        FROM dbo.[Group] G
        LEFT JOIN dbo.GeneratorGroup GG ON GG.GroupID = G.GroupID
        WHERE GG.GeneratorID = @GeneratorID
      `);

		const groupName = result.recordset?.[0]?.GroupName;
		return groupName || "Sem Grupo";
	});
}

function translateAlarm(message: string): string {
	switch (message) {
		case "Common Alarm":
			return "Alarme Comum";
		case "Genset Supplying Load":
			return "Gerador com Carga";
		case "Genset Running":
			return "Gerador Funcionando";
		case "Not In Auto":
			return "Não está em Automático";
		case "High Battery Voltage":
			return "Alta Tensão Bateria";
		case "Low Battery Voltage":
			return "Baixa Tensão Bateria";
		case "Charger AC Failure":
			return "Falha Carregador AC";
		case "Fail to Start":
			return "Falha na Partida";
		case "Low Coolant Temperature":
			return "Baixa Temperatura Refrigerante";
		case "Pre-High Engine Temperature":
			return "Alta Temperatura Motor";
		case "High Engine Temperature":
			return "Muito Alta Temperatura Motor";
		case "Pre-Low Oil Pressure":
			return "Baixa Pressão Óleo";
		case "Low Oil Pressure":
			return "Muito Baixa Pressão Óleo";
		case "Overspeed":
			return "Baixa Velocidade";
		case "Low Coolant Level":
			return "Nível Baixo Refrigerante";
		case "Low Fuel Level":
			return "Nível Baixo Combustível";

		case "Check Genset":
			return "Gerador OK";
		case "Ground Fault":
			return "Falta à Terra";
		case "High AC Voltage":
			return "Alta Tensão AC";
		case "Low AC Voltage":
			return "Baixa Tensão AC";
		case "Under Frequency":
			return "SubFrequência";
		case "Overload":
			return "Sobrecarga";
		case "Overcurrent":
			return "Sobrecorrente";
		case "Short Circuit":
			return "Curto Cicuito";
		case "Reverse kW":
			return "kW Reverso";
		case "Reverse kVAr":
			return "kVAr Reverso";
		case "Fail to Sync":
			return "Falha no Sincronismo";
		case "Fail to Close":
			return "Falha ao Fechar";
		case "Load Demand":
			return "Demanda de Carga";
		case "Genset Circuit Breaker Tripped":
			return "Disjuntor do Grupo Gerador Desarmado";
		case "Utility Circuit Breaker Tripped":
			return "Disjuntor da Rede Elétrica Desarmado";
		case "Emergency Stop":
			return "Parada de Emergência";
		default:
			return message;
	}
}

function getColorAndClassification(message: string): AlarmStyle {
	let color = "";
	let classification = "";

	switch (message) {
		case "Common Alarm":
			color = "#FF5252";
			classification = "Aviso ou Desligamento";
			break;

		case "Genset Supplying Load":
		case "Genset Running":
		case "Load Demand":
		case "Low Coolant Temperature":
		case "Not In Auto":
			color = "#52B5FF";
			classification = "Evento";
			break;

		case "Check Genset":
		case "High Battery Voltage":
		case "Low Battery Voltage":
		case "Pre-High Engine Temperature":
		case "Pre-Low Oil Pressure":
		case "Charger AC Failure":
		case "Overload":
		case "Fail to Sync":
		case "Genset Circuit Breaker Tripped":
		case "Utility Circuit Breaker Tripped":
		case "Low Fuel Level":
			color = "#FFE652";
			classification = "Aviso";
			break;

		case "Overcurrent":
		case "Short Circuit":
		case "High AC Voltage":
		case "Low AC Voltage":
		case "Under Frequency":
		case "Ground Fault":
		case "Overspeed":
		case "Low Oil Pressure":
		case "Low Coolant Level":
		case "High Engine Temperature":
		case "Reverse kW":
		case "Reverse kVAr":
		case "Fail to Close":
		case "Emergency Stop":
		case "Fail to Start":
			color = "#FF5252";
			classification = "Desligamento";
			break;

		default:
			color = "#83FF52";
			classification = "Alarme/Evento";
	}

	return { color, classification };
}

async function buildNewAlarmEmail(
	data: AlarmEmailInfo,
	alarm: EmailListRow,
	deps: {
		fetchGroupName: (generatorId: number) => Promise<string>;
		translateAlarm: (message: string) => string;
		getColorAndClassification: (message: string) => AlarmStyle;
	}
): Promise<{ recipient: string; subject: string; body: string }> {
	const Recipient = alarm.RecipientEmail;

	const GeneratorID = data.GENERATORID;
	const CompanyName = data.COMPANYNAME;
	const GeneratorName = data.GENERATORNAME;
	const SerialNumber = data.SERIALNUMBER;
	const Address = data.ADDRESS;
	const Entrance =
		data.ENTRANCE instanceof Date ? formatDateBr(data.ENTRANCE) : data.ENTRANCE;
	let Message = data.MESSAGE;
	const ModelName = data.MODELNAME;
	const Status = data.STATUS;
	const DeviceType = data.DEVICETYPE;

	const GroupName = await deps.fetchGroupName(GeneratorID);

	Message = deps.translateAlarm(Message);

	const Style = deps.getColorAndClassification(Message);
	const classification = Style.classification;
	const color = Style.color;

	const subject = `Alarme Monithor | ${GroupName} - ${GeneratorName}`;
	const date = formatDateBr(new Date());

	const body = `
<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>

<head>
	<meta charset='UTF-8'>
	<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
	<meta http-equiv='X-UA-Compatible' content='IE=edge' />
	<meta name='viewport' content='width=device-width, initial-scale=1.0'>
	<title> Alarm Notification </title>
	<style>
		body {
			font-family: Arial, sans-serif;
			background-color: #f7f7f7;
			margin: 0;
			padding: 20px;
		}

		.container {
			background-color: #fff;
			border-radius: 5px;
			box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
			padding: 20px;
		}

		.header {
			text-align: center;
			padding-bottom: 10px;
			padding-left: 4px;
			border-bottom: 1px solid #eee;
		}

		.content {
			color: #333;
		}

		.alert {
			background-color: ${color};
			color: #fff;
			padding: 10px;
			margin-bottom: 15px;
			border-radius: 4px;
		}

		.footer {
			text-align: center;
			font-size: 12px;
			color: #777;
		}

		.navbar {
			background-color: #000;
			border-bottom: 5px solid #FF000B;
			padding: 10px;
			border-radius: 4px;
		}

		.navbar-content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 10px;
		}

		.navbar-logo img {
			height: 28px;
			width: auto;
		}
	</style>
</head>

<body>
	<div class='container'>
		<div class='navbar'>
			<div class='navbar-content'>
				<div class='navbar-logo'>
					<img src='https://i.ibb.co/P1Jtnsr/motormac-navbar.png' alt='motormac_logo'>
				</div>
			</div>
		</div>

		<div class='header'>
			<h2> Notificação Monithor </h2>
		</div>

		<div class='content'>
			<div class='alert'>
				<p><strong>ATENÇÃO, NOVO ALARME OU EVENTO REGISTRADO PARA O EQUPAMENTO</strong></p>
			</div>
			<p>
				<strong>Empresa:</strong> ${CompanyName} <br>
				<strong>Grupo:</strong> ${GroupName} <br>
				<strong>Gerador:</strong> ${GeneratorName} <br>
				<strong>Serial:</strong> ${SerialNumber} <br>
				<strong>Modelo:</strong> ${ModelName} <br>
				<strong>${classification}:</strong> ${Message} <br>
				<strong>Entrada:</strong> ${Entrance} <br>
				<strong>Endereço:</strong> ${Address} <br>
				<strong>Dispositivo:</strong> ${DeviceType} <br>
				<strong>Status:</strong> ${Status} <br>
			</p>
		</div>

		<div class='footer'>
			Enviado por Monithor & Motormac - ${date}
		</div>
	</div>
</body>

</html>
`;

	return { recipient: Recipient, subject, body };
}

export async function sendQueuedAlarmEmails(): Promise<void> {
	await Connection(async (pool) => {
		console.log("Starting to send queued alarm emails...");

		const pending = await pool.request().query(`
      SELECT 
        EmailListID,
        RecipientEmail,
        AlarmID,
        AlarmMessage
      FROM Alarm.EmailList
      WHERE EmailSent = 0
    `);

		if (!pending.recordset.length) return;

		for (const row of pending.recordset as EmailListRow[]) {
			try {
				// Get alarm full info (same as PHP logic)
				const alarmInfoResult = await pool
					.request()
					.input("AlarmID", sql.Int, row.AlarmID)
					.query(`
            SELECT TOP (1)
              A.AlarmID AS ALARMID,
              C.ClientCompanyID AS CLIENTCOMPANYID,
              G.GeneratorID AS GENERATORID,
              C.CompanyName AS COMPANYNAME,
              G.[Name] AS GENERATORNAME,
              G.SerialNumber AS SERIALNUMBER,
              G.[Address] AS ADDRESS,
              A.Entrance AS ENTRANCE,
              A.Code AS CODE,
              A.Message AS MESSAGE,
              M.[Name] AS MODELNAME,
              G.[Status] AS STATUS,
              D.DeviceType AS DEVICETYPE
            FROM Modbus.Alarm A
            LEFT JOIN dbo.Generator G ON G.GeneratorID = A.GeneratorID
            LEFT JOIN Modbus.Device D ON D.GeneratorID = A.GeneratorID
            LEFT JOIN dbo.Model M ON M.ModelID = G.ModelID
            JOIN ClientCompany C ON C.ClientCompanyID = G.ClientCompanyID
            WHERE A.AlarmID = @AlarmID
          `);

				const alarmInfo = alarmInfoResult.recordset?.[0];
				if (!alarmInfo) {
					await pool
						.request()
						.input("id", sql.Int, row.EmailListID)
						.query(`
              UPDATE Alarm.EmailList
              SET LastTried = GETDATE()
              WHERE EmailListID = @id
            `);
					continue;
				}

				const email = await buildNewAlarmEmail(alarmInfo, row, {
					fetchGroupName,
					translateAlarm,
					getColorAndClassification,
				});

				await transporter.sendMail({
					from: process.env.EMAIL_FROM,
					to: email.recipient,
					subject: email.subject,
					html: email.body,
				});

				await pool
					.request()
					.input("id", sql.Int, row.EmailListID)
					.query(`
            UPDATE Alarm.EmailList
            SET EmailSent = 1, LastTried = GETDATE()
            WHERE EmailListID = @id
          `);

				logMessage(
					`Email enviado: AlarmID=${row.AlarmID} -> ${row.RecipientEmail}`,
					"nodemailer"
				);
			} catch (err) {
				await pool
					.request()
					.input("id", sql.Int, row.EmailListID)
					.query(`
            UPDATE Alarm.EmailList
            SET LastTried = GETDATE()
            WHERE EmailListID = @id
          `);

				logError(
					`Falha ao enviar email: AlarmID=${row.AlarmID} -> ${row.RecipientEmail}`,
					"nodemailer",
					err
				);

				throw err;
			}
		}
	});
}
