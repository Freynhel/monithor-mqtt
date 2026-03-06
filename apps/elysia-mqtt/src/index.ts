import { Elysia } from "elysia";
import { generatorController } from "./modules/generator/index";

const app = new Elysia()
	.use(generatorController)
	.listen(3001);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);