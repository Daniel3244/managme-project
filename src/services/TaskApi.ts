import { Task, TaskCreate, TaskUpdate } from "./TaskService";

const API_URL = "http://localhost:4000/api/tasks";

// Service for CRUD operations on tasks
export default class TaskApi {
  static async getAll(): Promise<Task[]> {
    // Get all tasks
    const res = await fetch(API_URL);
    return res.json();
  }

  static async get(id: string): Promise<Task> {
    // Get a single task by id
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
  }

  static async create(task: TaskCreate): Promise<Task> {
    // Create a new task
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return res.json();
  }

  static async update(id: string, update: TaskUpdate): Promise<Task> {
    // Update a task
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    return res.json();
  }

  static async delete(id: string): Promise<void> {
    // Delete a task
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  }
}
