import "dotenv/config";
import mqtt, { MqttClient } from "mqtt";
import sql from "mssql";
import { withDb as Connection, shutdown } from "@/lib/connection";
import { normalizePCC1302, normalizePCC3300, normalizeMCM3320 } from "@/app/normalizers/index";
import { formatDateLocaleBR } from "@monithor-mqtt/shared/lib/normalizerUtils";
import { alarmsRoutine, alarmLock } from "./process/alarms";

/*-----------------------------------------------------------------------------*/
/* 🔧 Constants and In-Memory State
/*-----------------------------------------------------------------------------*/

const MQTT_BROKER = "mqtt://test.mosquitto.org:1883";

let MQTT_TOPICS: Record<number, string> = {};
let TOPIC_TO_GENERATOR_ID: Record<string, number> = {};

/*-----------------------------------------------------------------------------*/
/* 🧠 Normalizers
/*-----------------------------------------------------------------------------*/

const normalizers: Record<string, (dl: Record<string, number>) => any> = {
	PCC1301: normalizePCC1302,
	PCC1302: normalizePCC1302,
	PCC3300: normalizePCC3300,
	MCM3320: normalizeMCM3320,
};

/*-----------------------------------------------------------------------------*/
/* 📝 In-Memory Cache for Last Payloads
/*-----------------------------------------------------------------------------*/

const lastPayloadCache: Record<number, string> = {};

/*-----------------------------------------------------------------------------*/
/* 🗄 Database – Fetch Topics
/*-----------------------------------------------------------------------------*/

async function fetchTopics(): Promise<Record<number, string>> {
	const topics: Record<number, string> = {};

	await Connection(async (pool) => {
		const result = await pool
			.request()
			.query(`
				SELECT GeneratorID, TopicMQTT
				FROM [dbo].[Generator]
				WHERE TopicMQTT IS NOT NULL
				AND ACTIVE = 1
			`);

		for (const row of result.recordset) {
			topics[row.GeneratorID] = row.TopicMQTT;
		}
	});

	return topics;
}

/*-----------------------------------------------------------------------------*/
/* 🔁 Topic Diff Helper
/*-----------------------------------------------------------------------------*/

function diffTopics(
	oldTopics: Record<number, string>,
	newTopics: Record<number, string>
) {
	const oldSet = new Set(Object.values(oldTopics));
	const newSet = new Set(Object.values(newTopics));

	return {
		toSubscribe: [...newSet].filter(t => !oldSet.has(t)),
		toUnsubscribe: [...oldSet].filter(t => !newSet.has(t)),
	};
}

/*-----------------------------------------------------------------------------*/
/* 🔄 Topic Polling + Subscribe / Unsubscribe
/*-----------------------------------------------------------------------------*/

async function startTopicPolling(intervalMs = 60000) {
	// Initial load
	MQTT_TOPICS = await fetchTopics();
	TOPIC_TO_GENERATOR_ID = Object.fromEntries(
		Object.entries(MQTT_TOPICS).map(([id, topic]) => [topic, Number(id)])
	);

	console.log("📡 Initial MQTT topics loaded:", MQTT_TOPICS);

	setInterval(async () => {
		try {
			const latestTopics = await fetchTopics();
			const { toSubscribe, toUnsubscribe } = diffTopics(MQTT_TOPICS, latestTopics);

			if (toSubscribe.length > 0) {
				client.subscribe(toSubscribe, err => {
					if (err) console.error("❌ Subscribe error:", err);
					else console.log("➕ Subscribed:", toSubscribe);
				});
			}

			if (toUnsubscribe.length > 0) {
				client.unsubscribe(toUnsubscribe, err => {
					if (err) console.error("❌ Unsubscribe error:", err);
					else console.log("➖ Unsubscribed:", toUnsubscribe);
				});
			}

			MQTT_TOPICS = latestTopics;
			TOPIC_TO_GENERATOR_ID = Object.fromEntries(
				Object.entries(MQTT_TOPICS).map(([id, topic]) => [topic, Number(id)])
			);

			console.log("🔄 MQTT topics refreshed:", MQTT_TOPICS);
		} catch (err) {
			console.error("❌ Failed to refresh MQTT topics:", err);
		}
	}, intervalMs);
}

/*-----------------------------------------------------------------------------*/
/* 🚀 MQTT Client
/*-----------------------------------------------------------------------------*/

const client: MqttClient = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
	console.log("✔ MQTT Conectado");
	client.subscribe(Object.values(MQTT_TOPICS));
});

client.on("error", err => {
	console.error("❌ MQTT error:", err.message);
});

client.on("offline", () => {
	console.warn("⚠ MQTT client offline");
});

/*-----------------------------------------------------------------------------*/
/* 📩 MQTT Message Handler
/*-----------------------------------------------------------------------------*/

client.on("message", async (topic: string, payload: Buffer) => {
	let msg: any;

	try {
		msg = JSON.parse(payload.toString());
	} catch {
		console.log("❌ Msg payload inválido, ignorando mensagem");
		return;
	}
	console.log(msg);
	const { dl, ts, da } = msg;
	if (!dl || !da) return;

	const normalizer = normalizers[da];

	if (!normalizer) {
		console.log(`❌ ${topic} No normalizer for device type: ${da}, ignoring message`);
		return;
	}

	const generatorId = TOPIC_TO_GENERATOR_ID[topic];
	if (!generatorId) return;

	const normalized = normalizer(dl);
	const payloadString = JSON.stringify(normalized);
	const logInfo = `[${formatDateLocaleBR(ts)}] ${topic} (${da})`;

	if (lastPayloadCache[generatorId] === payloadString) {
		console.log(`🟧 ${logInfo} Dados inalterados (cache), pulando insert`);
		return;
	}

	lastPayloadCache[generatorId] = payloadString;

	await insertAction(generatorId, payloadString, logInfo, ts);
	await alarmLock(generatorId, async () => {
		await alarmsRoutine(generatorId, normalized.alarm, ts);
	});
});

/*-----------------------------------------------------------------------------*/
/* 🗃️ Database Insert
/*-----------------------------------------------------------------------------*/

async function insertAction(
	generatorId: number,
	payloadString: string,
	logInfo: string,
	dateTime: string
) {
	try {
		await Connection(async (pool) => {
			await pool
				.request()
				.input("generatorId", sql.Int, generatorId)
				.input("dateTime", sql.DateTime, new Date(dateTime + "Z"))
				.input("jsonData", sql.VarChar(2048), payloadString)
				.query(`
					INSERT INTO [Modbus].[Data]
					(GeneratorID, DateTime, JSONData)
					VALUES (@generatorId, @dateTime, @jsonData)
				`);
		});

		console.log(`✅ ${logInfo} Dados inseridos no SQL Server`);
	} catch (error) {
		console.error("❌ DB insert error:", error);
	}
}

/*-----------------------------------------------------------------------------*/
/* 🛑 Shutdown
/*-----------------------------------------------------------------------------*/

process.on("SIGINT", async () => {
	console.log("⏹ Encerrando Conexão MQTT...");
	client.end(true, async () => {
		await shutdown();
		process.exit(0);
	});
});

process.on("SIGTERM", async () => {
	console.log("⏹ Closing MQTT connection...");
	client.end(true, async () => {
		await shutdown();
		process.exit(0);
	});
});

/*-----------------------------------------------------------------------------*/
/* ▶ Application Bootstrap (TOP-LEVEL AWAIT)
/*-----------------------------------------------------------------------------*/

await startTopicPolling();

/*-----------------------------------------------------------------------------*/
/* 🧠 Reference
/*-----------------------------------------------------------------------------*/
/*
  const MQTT_TOPICS = {
    21: "up/402A8F19A110", // PCC1302
    22: "up/402A8F1B4608", // PCC3300
  };
*/
