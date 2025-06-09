import React, { useState } from "react";
import TaskApi from "../services/TaskApi";
import { TaskCreate } from "../services/TaskService";

interface TaskFormProps {
  storyId: string;
  onCreated: () => void;
}

export default function TaskForm({ storyId, onCreated }: TaskFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"niski" | "średni" | "wysoki">("średni");
  const [estimatedTime, setEstimatedTime] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const task: TaskCreate = { name, description, priority, storyId, estimatedTime };
    await TaskApi.create(task);
    setName("");
    setDescription("");
    setPriority("średni");
    setEstimatedTime(1);
    onCreated();
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3">Dodaj Zadanie</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nazwa zadania</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nazwa zadania"
            required
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
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Priorytet</label>
          <select
            className="form-select"
            value={priority}
            onChange={e => setPriority(e.target.value as any)}
          >
            <option value="niski">Niski</option>
            <option value="średni">Średni</option>
            <option value="wysoki">Wysoki</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Przewidywany czas (h)</label>
          <input
            type="number"
            className="form-control"
            value={estimatedTime}
            onChange={e => setEstimatedTime(Number(e.target.value))}
            min={1}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          Dodaj Zadanie
        </button>
      </form>
    </div>
  );
}
