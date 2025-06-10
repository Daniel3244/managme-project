import { useState, useEffect } from "react";
import { Project } from "../services/ProjectService";

interface Props {
  onProjectAdded: (project: Omit<Project, "id">) => Promise<void>;
  onProjectUpdated: (project: Project) => Promise<void>;
  projectToEdit?: Project;
  resetEdit: () => void;
}

// Form for adding or editing a project
const ProjectForm: React.FC<Props> = ({ onProjectAdded, onProjectUpdated, projectToEdit, resetEdit }) => {
  // State for form fields
  const [name, setName] = useState(projectToEdit?.name || "");
  const [description, setDescription] = useState(projectToEdit?.description || "");

  useEffect(() => {
    // Fill form fields if editing, otherwise reset
    setName(projectToEdit?.name || "");
    setDescription(projectToEdit?.description || "");
  }, [projectToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    // Save or update project, then reset form
    e.preventDefault();
    if (!name.trim()) return;
    if (projectToEdit) {
      await onProjectUpdated({ id: projectToEdit.id, name, description });
    } else {
      await onProjectAdded({ name, description });
    }
    setName("");
    setDescription("");
    resetEdit();
  };

  return (
    // Project creation/edit form UI
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
