export interface Project {
  id: string;
  name: string;
  description: string;
}
class ProjectService {
  static async getProjects(): Promise<Project[]> {
    const res = await fetch("http://localhost:4000/api/projects");
    return res.json();
  }
  static async addProject(project: Omit<Project, "id">) {
    await fetch("http://localhost:4000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project)
    });
  }
  static async updateProject(updatedProject: Project) {
    await fetch(`http://localhost:4000/api/projects/${updatedProject.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject)
    });
  }
  static async deleteProject(id: string) {
    await fetch(`http://localhost:4000/api/projects/${id}`, { method: "DELETE" });
  }
}
export default ProjectService;
