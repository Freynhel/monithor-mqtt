import { Elysia, t } from "elysia";
import { qb } from "./db/queryBuilder";

const user = new Elysia()
	.get("/users", async () => {
		return qb.select("Users"); // SELECT * FROM [Users]
	})
	.get("/users/:id", async ({ params }: { params: { id: string } }) => {
		const id = Number(params.id);
		const rows = await qb.select("Users", { id });
		return rows[0] ?? null;
	})
	.post("/users", async ({ body }: { body: unknown }) => {
			const { email, name } = body as { email: string; name: string };
			return qb.insert("Users", { email, name });
		}, {
			body: t.Object({
				email: t.String(),
				name: t.String(),
			}),
		},
	)
	.put("/users/:id", async ({ params, body }: { params: { id: string }; body: unknown }) => {
			const id = Number(params.id);
			const updated = await qb.update(
				"Users",
				{ id },
				body as Record<string, unknown>,
			);
			return updated[0] ?? null;
		}, {
			body: t.Partial(
				t.Object({
					email: t.String(),
					name: t.String(),
				}),
			),
		},
	)
	.delete("/users/:id", async ({ params }: { params: { id: string } }) => {
		const id = Number(params.id);
		const count = await qb.remove("Users", { id });
		return { deleted: count };
	})

const app = new Elysia()
	.use(user)
	.listen(3001);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);