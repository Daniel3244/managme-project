export interface Project {
    id: number;
    name: string;
    description: string;
}

class ProjectService {
    static getProjects(): Project[] {
        const projects = localStorage.getItem("projects");
        return projects ? JSON.parse(projects) : [];
    }

    static saveProjects(projects: Project[]) {
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    static addProject(project: Omit<Project, "id">) {
        const projects = this.getProjects();
        const newProject: Project = { id: Date.now(), ...project };
        projects.push(newProject);
        this.saveProjects(projects);
    }

    static updateProject(updatedProject: Project) {
        let projects = this.getProjects();
        const index = projects.findIndex((project) => project.id === updatedProject.id);
        if (index !== -1) {
            projects[index] = updatedProject;
            this.saveProjects(projects);
        }
    }

    static deleteProject(id: number) {
        let projects = this.getProjects();
        projects = projects.filter(proj => proj.id !== id);
        this.saveProjects(projects);
    }
}

export default ProjectService;
