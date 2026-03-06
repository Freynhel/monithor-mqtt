// Business Logic – Generator module
// Talks exclusively to SQL Server through the shared queryBuilder (qb).

import { qb } from "../../db/queryBuilder";
import type {
	Generator,
	CreateGeneratorInput,
	UpdateGeneratorInput,
} from "./model";

const TABLE = "Generator";

export abstract class GeneratorService {
	// ── Basic CRUD ────────────────────────────────────────────────────────────

	static getAll(): Promise<Generator[]> {
		return qb.select<Generator>(TABLE);
	}

	static async getById(id: number): Promise<Generator | null> {
		const rows = await qb.select<Generator>(TABLE, { GeneratorID: id });
		return rows[0] ?? null;
	}

	static create(input: CreateGeneratorInput): Promise<Generator> {
		return qb.insert<Generator>(TABLE, input as Record<string, unknown>);
	}

	static async update(
		id: number,
		input: UpdateGeneratorInput,
	): Promise<Generator | null> {
		const rows = await qb.update<Generator>(
			TABLE,
			{ GeneratorID: id },
			input as Record<string, unknown>,
		);
		return rows[0] ?? null;
	}

	static async remove(id: number): Promise<number> {
		return qb.remove(TABLE, { GeneratorID: id });
	}

	// ── Dashboard payload (feeds generatorc/page.tsx) ─────────────────────────
	//
	// Returns ONE object shaped exactly to the `payload` constant used in the
	// front-end page, so the component can do a straight destructuring swap.

	static async getDashboard(generatorId: number) {
		// 1. Latest Modbus reading -------------------------------------------------
		const [telemetry] = await qb.query<Record<string, string | null>>(
			`SELECT TOP 1
				[Tipo do Controlador]      AS controllerType,
				[Modo de Operação]         AS operationMode,
				[Status do Grupo Gerador]  AS gensetState,
				[Falha Ativa]              AS activeFault,
				[Tipo de Falha Ativa]      AS activeFaultType,
				battery,
				oilpressure,
				temp,
				AN, BN, CN, AB, BC, CA,
				A,  B,  C,
				apparent,
				rotations,
				starts,
				hourmeter,
				[date]                     AS lastSeen
			FROM [Modbus].[Vw_ModbusDataChart]
			WHERE GeneratorID = @p0
			ORDER BY [date] DESC`,
			[generatorId],
		);

		// 2. Generator + Model info ------------------------------------------------
		const [info] = await qb.query<Record<string, unknown>>(
			`SELECT
				G.GeneratorID,
				G.SerialNumber,
				G.[Mode],
				G.ContactName,
				G.ContactNumber,
				G.ContactEmail,
				G.[Address],
				G.[Status],
				G.[Year],
				M.[Name] AS ModelName
			FROM  [dbo].[Generator] G
			LEFT JOIN [dbo].[Model] M ON M.ModelID = G.ModelID
			WHERE G.GeneratorID = @p0`,
			[generatorId],
		);

		if (!telemetry && !info) return null;

		// 3. Shape the payload to match page.tsx ----------------------------------
		const t = telemetry ?? {};
		const g = info ?? {};

		return {
			metrics: [
				{ id: 1,  key: "hourmeter",      label: "Funcionamento",    value: t.hourmeter   ?? "–", unit: "h",   color: "teal"   },
				{ id: 2,  key: "starts",         label: "Partidas",         value: t.starts      ?? "–", unit: "",    color: "pink"   },
				{ id: 3,  key: "temp",           label: "Temp. Refrig.",    value: t.temp        ?? "–", unit: "°C",  color: "yellow" },
				{ id: 4,  key: "oilpressure",    label: "Pressão Óleo",     value: t.oilpressure ?? "–", unit: "KPA", color: "blue"   },
				{ id: 5,  key: "operationMode",  label: "Modo de Operação", value: t.operationMode ?? "–", unit: "",  color: "orange" },
				{ id: 6,  key: "rotations",      label: "Rotação",          value: t.rotations   ?? "–", unit: "rpm", color: "teal"  },
				{ id: 7,  key: "frequency",      label: "Frequência",       value: t.frequency   ?? "–", unit: "Hz",  color: "pink"  },
				{ id: 8,  key: "battery",        label: "Tensão Bateria",   value: t.battery     ?? "–", unit: "Vcc", color: "yellow"},
				{ id: 9,  key: "fuelLevel",      label: "Nível Combustível",value: "–",                  unit: "%",   color: "blue"  },
				{ id: 10, key: "activeFault",    label: "Falha Ativa",      value: t.activeFault ?? "0", unit: "",    color: "orange"},
			],
			generalInfo: [
				["Número de Série",    g.SerialNumber   ?? "–"],
				["Modelo",             g.ModelName      ?? "–"],
				["Último Funcionamento", t.lastSeen     ?? "–"],
				["Modo",               g.Mode           ?? "–"],
				["Nome Contato",       g.ContactName    ?? "–"],
				["Endereço",           g.Address        ?? "–"],
				["Telefone Contato",   g.ContactNumber  ?? "–"],
				["Email Contato",      g.ContactEmail   ?? "–"],
			],
			generatorCurrent: [          // voltages (AN/BN/CN/AB/BC/CA)
				{ label: "AN", value: t.AN ?? "–", unit: "V" },
				{ label: "BN", value: t.BN ?? "–", unit: "V" },
				{ label: "CN", value: t.CN ?? "–", unit: "V" },
				{ label: "AB", value: t.AB ?? "–", unit: "V" },
				{ label: "BC", value: t.BC ?? "–", unit: "V" },
				{ label: "CA", value: t.CA ?? "–", unit: "V" },
			],
			generatorVoltage: [          // currents (A/B/C)
				{ label: "Fase A", value: t.A ?? "–", unit: "A" },
				{ label: "Fase B", value: t.B ?? "–", unit: "A" },
				{ label: "Fase C", value: t.C ?? "–", unit: "A" },
			],
			generatorPower: [
				{ label: "Aparente",  value: t.apparent ?? "–", unit: "kVA"  },
			],
			status: {
				gensetState:     t.gensetState     ?? null,
				operationMode:   t.operationMode   ?? null,
				activeFaultType: t.activeFaultType ?? null,
				controllerType:  t.controllerType  ?? null,
				lastSeen:        t.lastSeen        ?? null,
			},
		};
	}

	// ── Alarm list for a generator ────────────────────────────────────────────

	static getAlarms(generatorId: number, limit = 50) {
		return qb.query<Record<string, unknown>>(
			`SELECT TOP (@p1)
				AlarmID, GeneratorID, [DateTime], Entrance, [Exit], Code, [Message]
			FROM [Modbus].[Alarm]
			WHERE GeneratorID = @p0
			ORDER BY [DateTime] DESC`,
			[generatorId, limit],
		);
	}
}