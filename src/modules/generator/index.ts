// Controller/Elysia Instance

import { Elysia } from "elysia";
import { t } from "elysia";
import { TodoService } from "./service";
import { TodoModel } from "./model";

const service = new TodoService();

export const todoController = new Elysia({ prefix: "/todos" })
	.model("todo", TodoModel.todo)
	.model("createTodo", TodoModel.createTodo)
	.model("updateTodo", TodoModel.updateTodo)
	.get("/", () => service.getAll(), {
		response: "todo[]",
	})
	.get(
		"/:id",
		({ params: { id } }) => {
			const todo = service.getById(id);
			if (!todo) return new Response("Not Found", { status: 404 });
			return todo;
		},
		{
			params: t.Object({ id: t.Number() }),
			response: "todo",
		},
	)
	.post("/", ({ body }) => service.create(body), {
		body: "createTodo",
		response: "todo",
	})
	.patch(
		"/:id",
		({ params: { id }, body }) => {
			const todo = service.update(id, body);
			if (!todo) return new Response("Not Found", { status: 404 });
			return todo;
		},
		{
			params: t.Object({ id: t.Number() }),
			body: "updateTodo",
			response: "todo",
		},
	)
	.delete(
		"/:id",
		({ params: { id } }) => {
			const ok = service.remove(id);
			if (!ok) return new Response("Not Found", { status: 404 });
			return { deleted: true };
		},
		{
			params: t.Object({ id: t.Number() }),
			response: t.Object({ deleted: t.Boolean() }),
		},
	);
