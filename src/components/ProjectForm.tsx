import { useState, useEffect } from "react";
import ProjectService, { Project } from "../services/ProjectService";

interface Props {
  onProjectAdded: () => void;
  projectToEdit?: Project;
  resetEdit: () => void;
}

const ProjectForm: React.FC<Props> = ({ onProjectAdded, projectToEdit, resetEdit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [projectToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (projectToEdit) {
      ProjectService.updateProject({ ...projectToEdit, name, description });
    } else {
      ProjectService.addProject({ name, description });
    }

    setName("");
    setDescription("");
    onProjectAdded();
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
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Opis</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {projectToEdit ? "Zapisz" : "Dodaj"}
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
