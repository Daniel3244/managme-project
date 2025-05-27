import { useState, useEffect } from "react";
import { Story } from "../services/StoryService";

interface Props {
  storyToEdit?: Story;
  onStorySaved: (s: Omit<Story, "id" | "createdAt" | "ownerId"> & { id?: string }) => void;
  resetEdit: () => void;
  projectId: string;
}

const StoryForm: React.FC<Props> = ({ storyToEdit, onStorySaved, resetEdit, projectId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");

  useEffect(() => {
    if (storyToEdit) {
      setName(storyToEdit.name);
      setDescription(storyToEdit.description);
      setPriority(storyToEdit.priority);
      setStatus(storyToEdit.status);
    } else {
      setName("");
      setDescription("");
      setPriority("medium");
      setStatus("todo");
    }
  }, [storyToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onStorySaved({
      id: storyToEdit?.id,
      name,
      description,
      priority,
      status,
      projectId
    });
    resetEdit();
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3">{storyToEdit ? "Edytuj Historyjkę" : "Dodaj Historyjkę"}</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nazwa</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nazwa historyjki"
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
        <div className="mb-3">
          <label className="form-label">Priorytet</label>
          <select
            className="form-select"
            value={priority}
            onChange={e => setPriority(e.target.value as any)}
          >
            <option value="low">Niski</option>
            <option value="medium">Średni</option>
            <option value="high">Wysoki</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={e => setStatus(e.target.value as any)}
          >
            <option value="todo">To do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success">
          {storyToEdit ? "Zapisz zmiany" : "Dodaj Historyjkę"}
        </button>
        {storyToEdit && (
          <button type="button" className="btn btn-secondary ms-2" onClick={resetEdit}>
            Anuluj
          </button>
        )}
      </form>
    </div>
  );
};

export default StoryForm;
