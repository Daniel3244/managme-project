import ProjectService, { Project } from "../services/ProjectService";

interface Props {
  projects: Project[];
  onProjectDeleted: () => void;
  onProjectEdited: (p: Project) => void;
  onProjectSelected: (p: Project) => void;
}

const ProjectList: React.FC<Props> = ({
  projects,
  onProjectDeleted,
  onProjectEdited,
  onProjectSelected
}) => {
  return (
    <ul className="list-group">
      {projects.map(p => (
        <li
          key={p.id}
          data-cy="project-item"
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div className="text-start">
            <h6 className="mb-1">{p.name}</h6>
            <small className="text-muted">{p.description}</small>
          </div>
          <div className="btn-group" role="group">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onProjectSelected(p)}
            >
              Wybierz
            </button>
            <button
              className="btn btn-sm btn-warning"
              onClick={() => onProjectEdited(p)}
            >
              Edytuj
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                ProjectService.deleteProject(p.id);
                onProjectDeleted();
              }}
            >
              Usuń
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
