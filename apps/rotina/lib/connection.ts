import sql from "mssql";

/* =========================
   Configuration
   ========================= */

const config: sql.config = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_SERVER!,
	database: process.env.DB_NAME,
	requestTimeout: 15000,
	connectionTimeout: 15000,
	options: {
		// encrypt: true,
		// trustServerCertificate: process.env.NODE_ENV !== "production",
		encrypt: false,
		trustServerCertificate: true,
	},
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
};

let pool: sql.ConnectionPool | null = null;
let connecting: Promise<sql.ConnectionPool> | null = null;

async function createPool(): Promise<sql.ConnectionPool> {
	if (connecting) return connecting;

	connecting = (async () => {
		const p = new sql.ConnectionPool(config);
		await p.connect();
		pool = p;
		connecting = null;
		return p;
	})();

	return connecting;
}

export async function getPool(): Promise<sql.ConnectionPool> {
	if (pool?.connected) return pool;
	return createPool();
}

async function destroyPool() {
	if (!pool) return;

	try {
		await pool.close();
	} catch {
		// ignore close errors
	} finally {
		pool = null;
		connecting = null;
	}
}

export async function withDb<T>(
	fn: (pool: sql.ConnectionPool) => Promise<T>
): Promise<T> {
	try {
		const pool = await getPool();
		return await fn(pool);
	} catch (err) {
		// Any failure nukes the pool so next cycle cleanly reconnects
		await destroyPool();
		throw err;
	}
}

export async function isHealthy(): Promise<boolean> {
	try {
		await withDb((pool) => pool.request().query("SELECT 1"));
		return true;
	} catch {
		return false;
	}
}

export async function shutdown() {
	await destroyPool();
}

process.on("SIGINT", async () => {
	await shutdown();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	await shutdown();
	process.exit(0);
});