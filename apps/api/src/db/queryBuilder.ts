import sql, { config as SqlConfig, IResult } from "mssql";

const config: SqlConfig = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_HOST ?? "localhost",
	database: process.env.DB_NAME,
	options: {
		encrypt: true,
		trustServerCertificate: true,
	},
	pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

const poolPromise = sql.connect(config);

type Where = Record<string, unknown>;

function buildWhere(where?: Where) {
	if (!where || Object.keys(where).length === 0)
		return { clause: "", params: [] as unknown[] };

	const entries = Object.entries(where);
	const conditions = entries.map(([key], idx) => `[${key}] = @p${idx}`);
	const params = entries.map(([, value]) => value);
	return {
		clause: ` WHERE ${conditions.join(" AND ")}`,
		params,
	};
}

export const qb = {
	async select<T = unknown>(table: string, where?: Where): Promise<T[]> {
		const pool = await poolPromise;
		const { clause, params } = buildWhere(where);
		const request = pool.request();
		params.forEach((value, idx) => request.input(`p${idx}`, value));
		const result: IResult<T> = await request.query(
		`SELECT * FROM [${table}]${clause}`,
		);
		return result.recordset;
	},

	async insert<T = unknown>(
		table: string,
		data: Record<string, unknown>,
	): Promise<T> {
		const pool = await poolPromise;
		const keys = Object.keys(data);
		const cols = keys.map((k) => `[${k}]`).join(", ");
		const values = keys.map((_, idx) => `@p${idx}`).join(", ");

		const request = pool.request();
		keys.forEach((k, idx) => request.input(`p${idx}`, data[k]));

		const result: IResult<T> = await request.query(
		`INSERT INTO [${table}] (${cols}) OUTPUT INSERTED.* VALUES (${values})`,
		);
		return result.recordset[0];
	},

	async update<T = unknown>(
		table: string,
		where: Where,
		data: Record<string, unknown>,
	): Promise<T[]> {
		const pool = await poolPromise;
		const dataKeys = Object.keys(data);
		const setClause = dataKeys.map((k, idx) => `[${k}] = @d${idx}`).join(", ");

		const { clause: whereClause, params: whereParams } = buildWhere(where);

		const request = pool.request();
		dataKeys.forEach((k, idx) => request.input(`d${idx}`, data[k]));
		whereParams.forEach((value, idx) => request.input(`p${idx}`, value));

		const result: IResult<T> = await request.query(
		`UPDATE [${table}] SET ${setClause}${whereClause} OUTPUT INSERTED.*`,
		);
		return result.recordset;
	},

	async remove(table: string, where: Where): Promise<number> {
		const pool = await poolPromise;
		const { clause, params } = buildWhere(where);
		const request = pool.request();
		params.forEach((value, idx) => request.input(`p${idx}`, value));
		const result = await request.query(`DELETE FROM [${table}]${clause}`);
		return result.rowsAffected[0] ?? 0;
	},

	async query<T = unknown>(
		sqlText: string,
		params: unknown[] = []
	): Promise<T[]> {
		const pool = await poolPromise
		const request = pool.request()

		params.forEach((value, idx) => {
		request.input(`p${idx}`, value)
		})

		const result = await request.query<T>(sqlText)
		return result.recordset
	}
};
