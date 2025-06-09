import { Task, TaskCreate, TaskUpdate } from "./TaskService";

const API_URL = "http://localhost:4000/api/tasks";

export default class TaskApi {
  static async getAll(): Promise<Task[]> {
    const res = await fetch(API_URL);
    return res.json();
  }

  static async get(id: string): Promise<Task> {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
  }

  static async create(task: TaskCreate): Promise<Task> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return res.json();
  }

  static async update(id: string, update: TaskUpdate): Promise<Task> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    return res.json();
  }

  static async delete(id: string): Promise<void> {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  }
}
