import React, { useEffect, useState } from "react";
import TaskApi from "../services/TaskApi";
import { Task } from "../services/TaskService";

interface TaskListProps {
  storyId: string;
  onTaskClick: (task: Task) => void;
}

export default function TaskList({ storyId, onTaskClick }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    TaskApi.getAll().then(all => setTasks(all.filter(t => t.storyId === storyId)));
  }, [storyId]);

  return (
    <div>
      <h4>Zadania</h4>
      <ul>
        {tasks.map(task => (
          <li key={task.id} onClick={() => onTaskClick(task)} style={{ cursor: "pointer" }}>
            {task.name} ({task.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
