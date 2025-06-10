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

// Modal with details and edit for a single task
export default function TaskDetails({ taskId, onClose, onUpdated, stories }: TaskDetailsProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [assignUserId, setAssignUserId] = useState<number | undefined>();
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<"niski" | "średni" | "wysoki">("średni");
  const [editEstimatedTime, setEditEstimatedTime] = useState(1);
  // Static user list for demo
  const users: User[] = [
    { id: 1, firstName: "Jan", lastName: "Kowalski", role: "devops" },
    { id: 2, firstName: "Anna", lastName: "Nowak", role: "developer" },
  ];

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

  // Detect dark mode
  const isDark = typeof document !== 'undefined' && document.body.classList.contains('bg-dark');

  return (
    <div
      className="modal-content"
      style={{
        background: isDark ? '#23272f' : '#fff',
        color: isDark ? '#f1f1f1' : '#222',
        padding: 24,
        borderRadius: 12,
        minWidth: 350,
        maxWidth: 420,
        boxShadow: isDark ? '0 2px 16px #0008' : '0 2px 16px #0002',
        border: isDark ? '1px solid #333' : 'none',
      }}
    >
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
            <input className="form-control" type="number" value={editEstimatedTime} onChange={e => setEditEstimatedTime(Number(e.target.value))} />
          </div>
          <button className="btn btn-success me-2" onClick={handleEdit}>Zapisz zmiany</button>
          <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Anuluj</button>
        </>
      ) : (
        <>
          <div className="mb-2"><b>{task.name}</b></div>
          <div className="mb-2">{task.description}</div>
          <div className="mb-2">Priorytet: {task.priority}</div>
          <div className="mb-2">Przewidywany czas: {task.estimatedTime}h</div>
          <div className="mb-2">Historyjka: {storyName}</div>
          <div className="mb-2">Przypisane: {assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName} (${assignedUser.role})` : "-"}</div>
          <div className="mb-2">Stan: {task.status}</div>
          <div className="mb-2 text-muted" style={{ fontSize: '0.95em' }}>
            Utworzono: {task.createdAt ? new Date(task.createdAt).toLocaleString() : '-'}<br/>
            Rozpoczęto: {task.startedAt ? new Date(task.startedAt).toLocaleString() : '-'}<br/>
            Zakończono: {task.finishedAt ? new Date(task.finishedAt).toLocaleString() : '-'}
          </div>
          <div className="d-flex flex-wrap gap-2 mb-2">
            <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edytuj</button>
            <button className="btn btn-danger" onClick={handleDelete}>Usuń</button>
            {!task.assignedUserId && task.status === "todo" && (
              <>
                <select className="form-select d-inline w-auto" value={assignUserId} onChange={e => setAssignUserId(Number(e.target.value))}>
                  <option value="">Przypisz użytkownika</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.role})</option>
                  ))}
                </select>
                <button
                  className={`btn ${assignUserId ? 'btn-success' : 'btn-secondary'}`}
                  onClick={handleAssign}
                  disabled={!assignUserId}
                  style={!assignUserId ? { opacity: 0.6, pointerEvents: 'none' } : {}}
                >
                  Przypisz i przenieś do Doing
                </button>
              </>
            )}
            {task.status === "doing" && (
              <button className="btn btn-success" onClick={handleDone}>Przenieś do Done</button>
            )}
          </div>
          <button className="btn btn-outline-secondary float-end" onClick={onClose}>Zamknij</button>
        </>
      )}
    </div>
  );
}
