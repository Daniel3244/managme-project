// src/services/StoryService.ts
import UserService from "./UserService";

export interface Story {
  id: number;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  projectId: number;
  createdAt: string;
  status: "todo" | "doing" | "done";
  ownerId: number;
}

class StoryService {
  static getStories(projectId: number): Story[] {
    const s = localStorage.getItem(`project-${projectId}-stories`);
    return s ? JSON.parse(s) : [];
  }
  static saveStories(projectId: number, stories: Story[]) {
    localStorage.setItem(`project-${projectId}-stories`, JSON.stringify(stories));
  }
  static addStory(projectId: number, s: Omit<Story, "id" | "createdAt" | "ownerId">) {
    const stories = this.getStories(projectId);
    const newS: Story = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ownerId: UserService.getCurrentUser().id,
      ...s
    };
    stories.push(newS);
    this.saveStories(projectId, stories);
  }
  static updateStory(projectId: number, updated: Story) {
    let stories = this.getStories(projectId);
    const index = stories.findIndex(x => x.id === updated.id);
    if (index !== -1) {
      stories[index] = updated;
      this.saveStories(projectId, stories);
    }
  }
  static deleteStory(projectId: number, id: number) {
    let stories = this.getStories(projectId);
    stories = stories.filter(x => x.id !== id);
    this.saveStories(projectId, stories);
  }
}

export default StoryService;
