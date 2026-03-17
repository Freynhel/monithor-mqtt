// Controller – Generator module

import { Elysia, t } from "elysia";
import { GeneratorService } from "./service";
import { GeneratorModel } from "./model";

export const generatorController = new Elysia({ prefix: "/generators" })
	// Register shared type models so routes can reference them by name
	.model("generator",       GeneratorModel.generator)
	.model("createGenerator", GeneratorModel.createGenerator)
	.model("updateGenerator", GeneratorModel.updateGenerator)

	// ── GET /generators ────────────────────────────────────────────────────────
	.get("/", () => GeneratorService.getAll(), {
		detail: { summary: "List all generators" },
	})

	// ── GET /generators/:id ────────────────────────────────────────────────────
	.get(
		"/:id",
		async ({ params: { id }, error }: { params: { id: number }; error: any }) => {
			const gen = await GeneratorService.getById(id);
			if (!gen) return error(404, { message: "Generator not found" });
			return gen;
		},
		{
			params: t.Object({ id: t.Numeric() }),
			detail: { summary: "Get a single generator" },
		},
	)

	// ── GET /generators/:id/dashboard ─────────────────────────────────────────
	// Returns the payload object consumed by generatorc/page.tsx
	.get(
		"/:id/dashboard",
		async ({ params: { id }, error }: { params: { id: number }; error: any }) => {
			const data = await GeneratorService.getDashboard(id);
			if (!data) return error(404, { message: "No dashboard data found" });
			return data;
		},
		{
			params: t.Object({ id: t.Numeric() }),
			detail: { summary: "Get shaped dashboard payload for a generator" },
		},
	)

	// ── GET /generators/:id/alarms?limit=50 ───────────────────────────────────
	// Fetches alarm history from [Modbus].[Alarm]. Active alarms have Exit = NULL.
	.get(
		"/:id/alarms",
		({ params: { id }, query: { limit } }: { params: { id: number }; query: { limit?: number } }) =>
			GeneratorService.getAlarms(id, limit),
		{
			params: t.Object({ id: t.Numeric() }),
			query: t.Object({ limit: t.Optional(t.Numeric()) }),
			detail: { summary: "List recent alarms for a generator" },
		},
	)

	// ── GET /generators/:id/history?limit=30 ──────────────────────────────────
	// Returns recent historical telemetry rows from the appropriate Modbus view,
	// automatically selecting the correct view based on the generator's device type.
	// Intended for the history table on the dashboard (NOT for live telemetry —
	// that comes from MQTT over WebSocket).
	.get(
		"/:id/history",
		({ params: { id }, query: { limit } }: { params: { id: number }; query: { limit?: number } }) =>
			GeneratorService.getHistory(id, limit),
		{
			params: t.Object({ id: t.Numeric() }),
			query: t.Object({ limit: t.Optional(t.Numeric()) }),
			detail: { summary: "Get historical telemetry rows for a generator" },
		},
	)

	// ── POST /generators ───────────────────────────────────────────────────────
	.post(
		"/",
		({ body }: { body: unknown }) => GeneratorService.create(body),
		{
			body: "createGenerator",
			detail: { summary: "Create a new generator" },
		},
	)

	// ── PUT /generators/:id ────────────────────────────────────────────────────
	.put(
		"/:id",
		async ({ params: { id }, body, error }: { params: { id: number }; body: unknown; error: any }) => {
			const gen = await GeneratorService.update(id, body);
			if (!gen) return error(404, { message: "Generator not found" });
			return gen;
		},
		{
			params: t.Object({ id: t.Numeric() }),
			body: "updateGenerator",
			detail: { summary: "Update a generator" },
		},
	)

	// ── DELETE /generators/:id ─────────────────────────────────────────────────
	.delete(
		"/:id",
		async ({ params: { id }, error }: { params: { id: number }; error: any }) => {
			const count = await GeneratorService.remove(id);
			if (!count) return error(404, { message: "Generator not found" });
			return { deleted: true };
		},
		{
			params: t.Object({ id: t.Numeric() }),
			response: t.Object({ deleted: t.Boolean() }),
			detail: { summary: "Delete a generator" },
		},
	);