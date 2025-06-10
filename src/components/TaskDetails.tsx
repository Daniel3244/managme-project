import React, { useEffect, useState } from "react";
import TaskApi from "../services/TaskApi";
import { Task, TaskUpdate } from "../services/TaskService";
import { User } from "../services/UserService";
import { Story } from "../services/StoryService";

interface TaskDetailsProps {
  taskId: string;
  onClose: () => void;
  onUpdated: () => void;
  stories?: Story[];
}

export default function TaskDetails({ taskId, onClose, onUpdated, stories }: TaskDetailsProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [assignUserId, setAssignUserId] = useState<number | undefined>();
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<"niski" | "średni" | "wysoki">("średni");
  const [editEstimatedTime, setEditEstimatedTime] = useState(1);
  const users: User[] = [
    { id: 1, firstName: "Jan", lastName: "Kowalski", role: "devops" },
    { id: 2, firstName: "Anna", lastName: "Nowak", role: "developer" },
  ]; // Możesz pobrać z UserService jeśli będzie dynamiczne

  useEffect(() => {
    TaskApi.get(taskId).then(t => {
      setTask(t);
      setEditName(t.name);
      setEditDescription(t.description);
      setEditPriority(t.priority);
      setEditEstimatedTime(t.estimatedTime);
    });
  }, [taskId]);

  if (!task) return <div>Ładowanie...</div>;

  const storyName = stories?.find(s => s.id === task.storyId)?.name || task.storyId;
  const assignedUser = users.find(u => u.id === task?.assignedUserId);

  const handleAssign = async () => {
    if (!assignUserId) return;
    const update: TaskUpdate = {
      assignedUserId: assignUserId,
      status: "doing",
      startedAt: new Date().toISOString(),
    };
    await TaskApi.update(taskId, update);
    onUpdated();
  };

  const handleDone = async () => {
    const update: TaskUpdate = {
      status: "done",
      finishedAt: new Date().toISOString(),
    };
    await TaskApi.update(taskId, update);
    onUpdated();
  };

  const handleDelete = async () => {
    await TaskApi.delete(taskId);
    onUpdated();
  };

  const handleEdit = async () => {
    await TaskApi.update(taskId, {
      name: editName,
      description: editDescription,
      priority: editPriority,
      estimatedTime: editEstimatedTime,
    });
    setEditMode(false);
    onUpdated();
  };

  return (
    <div className="modal-content" style={{ background: "#fff", padding: 24, borderRadius: 12, minWidth: 350, maxWidth: 420 }}>
      <h4 className="mb-3">Szczegóły zadania</h4>
      {editMode ? (
        <>
          <div className="mb-2">
            <label className="form-label">Nazwa</label>
            <input className="form-control" value={editName} onChange={e => setEditName(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="form-label">Opis</label>
            <input className="form-control" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="form-label">Priorytet</label>
            <select className="form-select" value={editPriority} onChange={e => setEditPriority(e.target.value as any)}>
              <option value="niski">Niski</option>
              <option value="średni">Średni</option>
              <option value="wysoki">Wysoki</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label">Przewidywany czas (h)</label>
            <input type="number" className="form-control" value={editEstimatedTime} onChange={e => setEditEstimatedTime(Number(e.target.value))} min={1} />
          </div>
          <button className="btn btn-success me-2" onClick={handleEdit}>Zapisz zmiany</button>
          <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Anuluj</button>
        </>
      ) : (
        <>
          <div className="mb-2"><b>Nazwa:</b> {task.name}</div>
          <div className="mb-2"><b>Opis:</b> {task.description}</div>
          <div className="mb-2"><b>Priorytet:</b> {task.priority}</div>
          <div className="mb-2"><b>Historyjka:</b> {storyName}</div>
          <div className="mb-2"><b>Przewidywany czas:</b> {task.estimatedTime}h</div>
          <div className="mb-2"><b>Stan:</b> {task.status}</div>
          <div className="mb-2"><b>Data dodania:</b> {new Date(task.createdAt).toLocaleString()}</div>
          {task.startedAt && <div className="mb-2"><b>Data startu:</b> {new Date(task.startedAt).toLocaleString()}</div>}
          {task.finishedAt && <div className="mb-2"><b>Data zakończenia:</b> {new Date(task.finishedAt).toLocaleString()}</div>}
          {assignedUser && <div className="mb-2"><b>Użytkownik odpowiedzialny:</b> {assignedUser.firstName} {assignedUser.lastName} ({assignedUser.role})</div>}
          {task.status === "todo" && (
            <div className="mb-2">
              <select className="form-select mb-2" onChange={e => setAssignUserId(Number(e.target.value))} defaultValue="">
                <option value="">Przypisz osobę</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.role})</option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handleAssign} disabled={!assignUserId}>Przypisz i przenieś do Doing</button>
            </div>
          )}
          {task.status === "doing" && (
            <div className="mb-2">
              <button className="btn btn-primary" onClick={handleDone}>Przenieś do Done</button>
            </div>
          )}
          {task.status === "done" && task.startedAt && task.finishedAt && (() => {
            const ms = new Date(task.finishedAt).getTime() - new Date(task.startedAt).getTime();
            const hours = Math.floor(ms / 3600000);
            const minutes = Math.floor((ms % 3600000) / 60000);
            return (
              <div className="mb-2"><b>Czas realizacji:</b> {hours} godzin{hours !== 1 ? "" : "a"} {minutes} minut</div>
            );
          })()}
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-warning" onClick={() => setEditMode(true)}>Edytuj</button>
            <button className="btn btn-danger" onClick={handleDelete}>Usuń</button>
            <button className="btn btn-secondary" onClick={onClose}>Zamknij</button>
          </div>
        </>
      )}
    </div>
  );
}
