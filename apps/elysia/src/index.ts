import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { generatorController } from "./modules/generator/index";
import { qb } from "./db/queryBuilder";


// ── App ───────────────────────────────────────────────────────────────────────

const app = new Elysia()
	.use(
		cors({
			origin: "http://localhost:3000",   // only this origin is allowed
			credentials: true,
    	})
	)
	.use(generatorController)
	.listen(3001);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
