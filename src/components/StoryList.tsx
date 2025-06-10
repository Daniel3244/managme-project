import TaskForm from "./TaskForm";
import { useState, useEffect } from "react";
import TaskDetails from "./TaskDetails";
import { Story } from "../services/StoryService";
import KanbanBoard from "./KanbanBoard";
import { Task } from "../services/TaskService";

interface Props {
  stories: Story[];
  onEdit: (s: Story) => void;
  onDelete: (id: string) => void;
  onStatusChange: (s: Story, newStatus: "todo" | "doing" | "done") => void;
  currentUser: { id: string; firstName: string; lastName: string };
  selectedStoryId: string | null;
  setSelectedStoryId: (id: string | null) => void;
}

// List of user stories with Kanban and task details
const StoryList: React.FC<Props> = ({ stories, onEdit, onDelete, onStatusChange, currentUser, selectedStoryId, setSelectedStoryId }) => {
  // State for filter, selected task, and Kanban refresh
  const [filter, setFilter] = useState<"all" | "todo" | "doing" | "done">("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [refreshKanban, setRefreshKanban] = useState(0);
  const [pendingKanbanRefresh, setPendingKanbanRefresh] = useState(false);
  const filteredStories =
    filter === "all" ? stories : stories.filter(s => s.status === filter);
  // Only allow moving forward in status
  const forwardOnlyStatus = (s: Story): ("todo" | "doing" | "done")[] => {
    if (s.status === "todo") return ["doing"];
    if (s.status === "doing") return ["done"];
    return [];
  };

  const handleTaskCreated = () => {
    // Refresh Kanban after task creation
    setRefreshKanban(r => r + 1);
  };

  useEffect(() => {
    // Refresh Kanban after closing task details
    if (!selectedTask && pendingKanbanRefresh) {
      setRefreshKanban(r => r + 1);
      setPendingKanbanRefresh(false);
    }
  }, [selectedTask, pendingKanbanRefresh]);

  return (
    <div>
      <div className="mb-3 d-flex align-items-center">
        <label className="me-2 fw-bold">Filtruj status:</label>
        <select
          className="form-select w-auto"
          value={filter}
          onChange={e => setFilter(e.target.value as any)}
        >
          <option value="all">Wszystkie</option>
          <option value="todo">To do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
      </div>
      <ul className="list-group">
        {filteredStories.map(s => (
          <li
            key={s.id}
            data-cy="story-item"
            data-story-id={s.id}
            className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center"
          >
            <div className="mb-2 mb-md-0">
              <h5 className="mb-1">{s.name}</h5>
              <p className="mb-1">{s.description}</p>
              <div className="small text-muted">
                Priorytet: <strong>{s.priority}</strong> | Status: <strong className="text-uppercase">{s.status}</strong>
              </div>
              <div className="small text-muted">
                Utworzono: {s.createdAt && typeof s.createdAt === 'string' && s.createdAt.length > 5 && !isNaN(Date.parse(s.createdAt)) ? new Date(s.createdAt).toLocaleString() : 'brak'}
                {" | Właściciel: "}
                {s.ownerId && currentUser && (s.ownerId === currentUser.id || s.ownerId === String(currentUser.id))
                  ? `${currentUser.firstName} ${currentUser.lastName}`
                  : (s.ownerId && s.ownerId !== '' ? s.ownerId : 'brak')}
              </div>
            </div>
            <div className="btn-group mt-2 mt-md-0" role="group">
              <button className="btn btn-sm btn-info" onClick={e => { e.stopPropagation(); onEdit(s); }}>
                Edytuj
              </button>
              <button className="btn btn-sm btn-danger" onClick={e => { e.stopPropagation(); onDelete(s.id); }}>
                Usuń
              </button>
              {forwardOnlyStatus(s).map(status => (
                <button
                  key={status}
                  className="btn btn-sm btn-secondary"
                  onClick={e => { e.stopPropagation(); onStatusChange(s, status); }}
                >
                  Przenieś do {status}
                </button>
              ))}
              <button
                className="btn btn-sm btn-primary ms-2"
                data-cy={`choose-story-${s.id}`}
                onClick={e => { e.stopPropagation(); setSelectedStoryId(s.id); }}
              >
                Wybierz
              </button>
            </div>
          </li>
        ))}
      </ul>
      {selectedStoryId && (
        <div className="mt-4">
          <div className="fw-bold mb-2">
            Aktywna Historyjka: {stories.find(s => s.id === selectedStoryId)?.name}
          </div>
          <button className="btn btn-outline-secondary mb-3" onClick={() => setSelectedStoryId(null)}>
            Odmapuj Historyjkę
          </button>
          <TaskForm storyId={selectedStoryId} onCreated={handleTaskCreated} />
          <KanbanBoard storyId={selectedStoryId} refreshKanban={refreshKanban} onTaskClick={setSelectedTask} />
        </div>
      )}
      {selectedTask && selectedTask.id && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <TaskDetails taskId={selectedTask.id as string} onClose={() => setSelectedTask(null)} onUpdated={() => { setSelectedTask(null); setPendingKanbanRefresh(true); }} stories={stories} />
        </div>
      )}
    </div>
  );
};

export default StoryList;
