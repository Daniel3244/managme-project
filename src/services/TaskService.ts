export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
  id?: string;
  name: string;
  description: string;
  priority: "niski" | "średni" | "wysoki";
  storyId: string;
  estimatedTime: number;
  status: TaskStatus;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  assignedUserId?: number;
  actualTime?: number;
}

export interface TaskCreate {
  name: string;
  description: string;
  priority: "niski" | "średni" | "wysoki";
  storyId: string;
  estimatedTime: number;
}

export interface TaskUpdate {
  name?: string;
  description?: string;
  priority?: "niski" | "średni" | "wysoki";
  estimatedTime?: number;
  status?: TaskStatus;
  startedAt?: string;
  finishedAt?: string;
  assignedUserId?: number;
  actualTime?: number;
}
