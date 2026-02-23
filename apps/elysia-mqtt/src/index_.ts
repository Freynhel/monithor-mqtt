import { Elysia } from "elysia";
import { todoController } from "./modules/generator";

const app = new Elysia()
	.use(todoController)
	.get("/", () => ({ status: "ok" }))
	.listen(3000);

console.log(`📝 Todo API on http://localhost:${app.server?.port}`);
