// Business Logic

import type { Todo, CreateTodoInput, UpdateTodoInput } from "./model";

let todos: Todo[] = [];
let nextId = 1;

export class TodoService {
	getAll(): Todo[] {
		return todos;
	}

	getById(id: number): Todo | undefined {
		return todos.find((t) => t.id === id);
	}

	create(input: CreateTodoInput): Todo {
		const todo: Todo = {
			id: nextId++,
			title: input.title,
			done: false,
		};
		todos.push(todo);
		return todo;
	}

	update(id: number, input: UpdateTodoInput): Todo | undefined {
		const todo = this.getById(id);
		if (!todo) return undefined;

		if (typeof input.title === "string") {
			todo.title = input.title;
		}
		if (typeof input.done === "boolean") {
			todo.done = input.done;
		}
		return todo;
	}

	remove(id: number): boolean {
		const index = todos.findIndex((t) => t.id === id);
		if (index === -1) return false;
		todos.splice(index, 1);
		return true;
	}
}
