import ProjectService, { Project } from "../services/projectService";

interface ProjectListProps {
    projects: Project[];
    onProjectDeleted: () => void;
    onProjectEdited: (project: Project) => void; // Funkcja do edycji
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectDeleted, onProjectEdited }) => {
    return (
        <ul className="list-group mt-4">
            {projects.map((project) => (
                <li key={project.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{project.name}</strong>
                        <p>{project.description}</p>
                    </div>
                    <button
                        onClick={() => {
                            ProjectService.deleteProject(project.id);
                            onProjectDeleted();
                        }}
                        className="btn btn-danger btn-sm"
                    >
                        Usuń
                    </button>
                    <button
                        onClick={() => onProjectEdited(project)} // Wywołanie edycji
                        className="btn btn-warning btn-sm ms-2"
                    >
                        Edytuj
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ProjectList;
