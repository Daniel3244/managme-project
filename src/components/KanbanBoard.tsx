import React, { useEffect, useState } from "react";
import TaskApi from "../services/TaskApi";
import { User } from "../services/UserService";
import { Task } from "../services/TaskService";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

function KanbanColumn({ title, tasks, onTaskClick, users }: KanbanColumnProps & { users: User[] }) {
  return (
    <div className="kanban-column">
      <h3>{title}</h3>
      {tasks.length === 0 && <div className="text-muted" style={{ minHeight: 32 }}>&nbsp;</div>}
      {tasks.map(task => {
        const assignedUser = users.find(u => u.id === task.assignedUserId);
        return (
          <div
            key={task.id}
            className="kanban-task-card"
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
  refreshKanban?: number;
}

export default function KanbanBoard({ storyId, onTaskClick, refreshKanban }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const users: User[] = [
    { id: 1, firstName: "Jan", lastName: "Kowalski", role: "devops" },
    { id: 2, firstName: "Anna", lastName: "Nowak", role: "developer" },
  ]; // Możesz pobrać z UserService jeśli będzie dynamiczne

  useEffect(() => {
    TaskApi.getAll().then(all => {
      setTasks(storyId ? all.filter(t => t.storyId === storyId) : all);
    });
  }, [storyId, refreshKanban]);

  const todo = tasks.filter(t => t.status === "todo");
  const doing = tasks.filter(t => t.status === "doing");
  const done = tasks.filter(t => t.status === "done");

  return (
    <div className="kanban-board">
      <KanbanColumn title="To Do" tasks={todo} onTaskClick={onTaskClick || (() => {})} users={users} />
      <KanbanColumn title="Doing" tasks={doing} onTaskClick={onTaskClick || (() => {})} users={users} />
      <KanbanColumn title="Done" tasks={done} onTaskClick={onTaskClick || (() => {})} users={users} />
    </div>
  );
}
