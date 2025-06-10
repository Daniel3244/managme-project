// Story type and CRUD service
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

// Service for CRUD operations on stories (user stories)
export class StoryService {
  static async getStories(projectId: string) {
    // Get all stories for a project
    const res = await fetch(`http://localhost:4000/api/projects/${projectId}/stories`);
    return res.json();
  }

  static async addStory(projectId: string, s: Omit<Story, "id">) {
    // Add a new story
    const res = await fetch(`http://localhost:4000/api/projects/${projectId}/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s)
    });
    return res.json();
  }

  static async updateStory(projectId: string, story: Story) {
    // Update a story
    await fetch(`http://localhost:4000/api/projects/${projectId}/stories/${story.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(story)
    });
  }

  static async deleteStory(projectId: string, id: string) {
    // Delete a story
    await fetch(`http://localhost:4000/api/projects/${projectId}/stories/${id}`, { method: "DELETE" });
  }
}

export default StoryService;
