// DTO / schemas

import { t } from "elysia";

export const TodoModel = {
	todo: t.Object({
		id: t.Number(),
		title: t.String(),
		done: t.Boolean(),
	}),
	createTodo: t.Object({
		title: t.String(),
	}),
	updateTodo: t.Object({
		title: t.Optional(t.String()),
		done: t.Optional(t.Boolean()),
	}),
};

export type Todo = typeof TodoModel.todo.static;
export type CreateTodoInput = typeof TodoModel.createTodo.static;
export type UpdateTodoInput = typeof TodoModel.updateTodo.static;
