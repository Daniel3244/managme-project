import React, { useEffect, useState } from "react";
import TaskApi from "../services/TaskApi";
import { Task } from "../services/TaskService";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

function KanbanColumn({ title, tasks, onTaskClick }: KanbanColumnProps) {
  return (
    <div className="kanban-column" style={{ flex: 1, margin: 8, background: "#f4f4f4", borderRadius: 8, padding: 8, minHeight: 120 }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 600 }}>{title}</h3>
      {tasks.length === 0 && <div className="text-muted" style={{ minHeight: 32 }}>&nbsp;</div>}
      {tasks.map(task => {
        // Przykładowi użytkownicy (możesz pobrać z serwisu jeśli chcesz)
        const users = [
          { id: 1, firstName: "Jan", lastName: "Kowalski", role: "devops" },
          { id: 2, firstName: "Anna", lastName: "Nowak", role: "developer" },
        ];
        const assignedUser = users.find(u => u.id === task.assignedUserId);
        return (
          <div
            key={task.id}
            className="kanban-task-card"
            style={{
              background: "#fff",
              margin: "8px 0",
              padding: 12,
              borderRadius: 8,
              boxShadow: "0 2px 8px 0 rgba(60,72,100,0.08)",
              cursor: "pointer",
              border: "1px solid #e3e6f3",
              transition: "box-shadow 0.2s, border 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start"
            }}
            onClick={() => onTaskClick(task)}
          >
            <div style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: 4 }}>{task.name}</div>
            {task.description && <div style={{ fontSize: "0.95rem", color: "#666", marginBottom: 2 }}>{task.description}</div>}
            <div style={{ fontSize: "0.85rem", color: "#888" }}>Priorytet: <b>{task.priority}</b></div>
            <div style={{ fontSize: "0.85rem", color: "#888" }}>Czas: {task.estimatedTime}h</div>
            {assignedUser && (
              <div style={{ fontSize: "0.85rem", color: "#888" }}>Osoba: {assignedUser.firstName} {assignedUser.lastName} ({assignedUser.role})</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Przyjmij opcjonalny storyId do filtrowania zadań na tablicy kanban
interface KanbanBoardProps {
  storyId?: string;
  onTaskClick?: (task: Task) => void;
}

export default function KanbanBoard({ storyId, onTaskClick }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    TaskApi.getAll().then(all => {
      setTasks(storyId ? all.filter(t => t.storyId === storyId) : all);
    });
  }, [storyId]);

  const todo = tasks.filter(t => t.status === "todo");
  const doing = tasks.filter(t => t.status === "doing");
  const done = tasks.filter(t => t.status === "done");

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <KanbanColumn title="To Do" tasks={todo} onTaskClick={onTaskClick || (() => {})} />
      <KanbanColumn title="Doing" tasks={doing} onTaskClick={onTaskClick || (() => {})} />
      <KanbanColumn title="Done" tasks={done} onTaskClick={onTaskClick || (() => {})} />
    </div>
  );
}
