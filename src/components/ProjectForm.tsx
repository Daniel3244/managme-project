import { useState, useEffect } from "react";
import ProjectService, { Project } from "../services/ProjectService";

interface Props {
  onProjectAdded: (project: Project) => Promise<void>;
  projectToEdit?: Project;
  resetEdit: () => void;
}

const ProjectForm: React.FC<Props> = ({ onProjectAdded, projectToEdit, resetEdit }) => {
  const [name, setName] = useState(projectToEdit?.name || "");
  const [description, setDescription] = useState(projectToEdit?.description || "");

  useEffect(() => {
    setName(projectToEdit?.name || "");
    setDescription(projectToEdit?.description || "");
  }, [projectToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onProjectAdded({ name, description });
    setName("");
    setDescription("");
    resetEdit();
  };

  return (
    <div>
      <h5 className="mb-3">{projectToEdit ? "Edytuj Projekt" : "Dodaj Projekt"}</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nazwa</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nazwa projektu"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Opis</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Opis"
          />
        </div>
        <button type="submit" className="btn btn-success">
          {projectToEdit ? "Zapisz zmiany" : "Dodaj Projekt"}
        </button>
        {projectToEdit && (
          <button type="button" className="btn btn-secondary ms-2" onClick={resetEdit}>
            Anuluj
          </button>
        )}
      </form>
    </div>
  );
};

export default ProjectForm;
