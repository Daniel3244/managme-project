import { useState, useEffect } from "react";
import ProjectService from "../services/projectService";
import { Project } from "../services/projectService"; 

interface ProjectFormProps {
    onProjectAdded: () => void;
    projectToEdit?: Project;
    resetEdit: () => void; // Funkcja do resetowania trybu edycji
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onProjectAdded, projectToEdit, resetEdit }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (projectToEdit) {
            setName(projectToEdit.name);
            setDescription(projectToEdit.description);
        }
    }, [projectToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (projectToEdit) {
            // Edytujemy istniejący projekt
            ProjectService.updateProject({ ...projectToEdit, name, description });
        } else {
            // Dodajemy nowy projekt
            ProjectService.addProject({ name, description });
        }

        setName("");
        setDescription("");
        onProjectAdded();
        resetEdit(); // Resetujemy tryb edycji po zapisaniu
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Nazwa projektu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <textarea
                    placeholder="Opis"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">
                {projectToEdit ? "Zapisz Zmiany" : "Dodaj Projekt"}
            </button>
        </form>
    );
};

export default ProjectForm;
