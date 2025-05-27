// src/services/StoryService.ts
import UserService from "./UserService";

export interface Story {
  id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  projectId: string;
  createdAt: string;
  status: "todo" | "doing" | "done";
  ownerId: string;
}

export class StoryService {
  static async getStories(projectId: string) {
    const res = await fetch(`http://localhost:4000/api/projects/${projectId}/stories`);
    return res.json();
  }

  static async addStory(projectId: string, s: Omit<Story, "id" | "createdAt" | "ownerId">) {
    await fetch(`http://localhost:4000/api/projects/${projectId}/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s)
    });
  }

  static async updateStory(projectId: string, story: Story) {
    await fetch(`http://localhost:4000/api/projects/${projectId}/stories/${story.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(story)
    });
  }

  static async deleteStory(projectId: string, id: string) {
    await fetch(`http://localhost:4000/api/projects/${projectId}/stories/${id}`, { method: "DELETE" });
  }
}

export default StoryService;
