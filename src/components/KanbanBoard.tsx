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
    // Kanban column UI with task cards
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

interface KanbanBoardProps {
  storyId?: string;
  onTaskClick?: (task: Task) => void;
  refreshKanban?: number;
}

// Main Kanban board with columns
export default function KanbanBoard({ storyId, onTaskClick, refreshKanban }: KanbanBoardProps) {
  // State for tasks and static user list
  const [tasks, setTasks] = useState<Task[]>([]);
  // Static user list for demo
  const users: User[] = [
    { id: 1, firstName: "Jan", lastName: "Kowalski", role: "devops" },
    { id: 2, firstName: "Anna", lastName: "Nowak", role: "developer" },
  ];

  useEffect(() => {
    // Fetch tasks for the selected story
    TaskApi.getAll().then(all => {
      setTasks(storyId ? all.filter(t => t.storyId === storyId) : all);
    });
  }, [storyId, refreshKanban]);

  // Split tasks by status
  const todo = tasks.filter(t => t.status === "todo");
  const doing = tasks.filter(t => t.status === "doing");
  const done = tasks.filter(t => t.status === "done");

  return (
    // Kanban board UI with columns
    <div className="kanban-board">
      <KanbanColumn title="To Do" tasks={todo} onTaskClick={onTaskClick || (() => {})} users={users} />
      <KanbanColumn title="Doing" tasks={doing} onTaskClick={onTaskClick || (() => {})} users={users} />
      <KanbanColumn title="Done" tasks={done} onTaskClick={onTaskClick || (() => {})} users={users} />
    </div>
  );
}
