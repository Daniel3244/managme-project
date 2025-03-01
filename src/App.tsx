import { useState, useEffect } from "react";
import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProjectService, { Project } from "./services/projectService";

const App: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(undefined);

    useEffect(() => {
        setProjects(ProjectService.getProjects());
    }, []);

    const refreshProjects = () => {
        setProjects(ProjectService.getProjects());
    };

    const handleEditProject = (project: Project) => {
        setProjectToEdit(project);
    };

    // Funkcja do resetowania stanu edycji
    const resetEdit = () => {
        setProjectToEdit(undefined);
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="p-4 border rounded shadow" style={{ maxWidth: '600px', width: '100%' }}>
                <h1 className="text-center mb-4">ManagMe - Projekty</h1>
                <ProjectForm 
                    onProjectAdded={refreshProjects} 
                    projectToEdit={projectToEdit} 
                    resetEdit={resetEdit} // Przekazujemy funkcję resetującą stan edycji
                />
                <ProjectList
                    projects={projects}
                    onProjectDeleted={refreshProjects}
                    onProjectEdited={handleEditProject}
                />
            </div>
        </div>
    );
};

export default App;
