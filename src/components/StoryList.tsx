import TaskForm from "./TaskForm";
import { useState } from "react";
import TaskDetails from "./TaskDetails";
import { Story } from "../services/StoryService";
import KanbanBoard from "./KanbanBoard";

interface Props {
  stories: Story[];
  onEdit: (s: Story) => void;
  onDelete: (id: string) => void;
  onStatusChange: (s: Story, newStatus: "todo" | "doing" | "done") => void;
  currentUser: { id: string; firstName: string; lastName: string };
  selectedStoryId: string | null;
  setSelectedStoryId: (id: string | null) => void;
}

const StoryList: React.FC<Props> = ({ stories, onEdit, onDelete, onStatusChange, currentUser, selectedStoryId, setSelectedStoryId }) => {
  const [filter, setFilter] = useState<"all" | "todo" | "doing" | "done">("all");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [refreshKanban, setRefreshKanban] = useState(0);
  const filteredStories =
    filter === "all" ? stories : stories.filter(s => s.status === filter);
  const forwardOnlyStatus = (s: Story): ("todo" | "doing" | "done")[] => {
    if (s.status === "todo") return ["doing"];
    if (s.status === "doing") return ["done"];
    return [];
  };

  const handleTaskCreated = () => {
    setRefreshKanban(r => r + 1);
  };

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
            className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center"
          >
            <div className="mb-2 mb-md-0">
              <h5 className="mb-1">{s.name}</h5>
              <p className="mb-1">{s.description}</p>
              <div className="small text-muted">
                Priorytet: <strong>{s.priority}</strong> | Status: <strong className="text-uppercase">{s.status}</strong>
              </div>
              <div className="small text-muted">
                Utworzono: {new Date(s.createdAt).toLocaleString()} | Właściciel: {s.ownerId === currentUser.id ? "Ty" : s.ownerId}
              </div>
            </div>
            <div className="btn-group mt-2 mt-md-0" role="group">
              <button className="btn btn-sm btn-info" onClick={() => onEdit(s)}>
                Edytuj
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(s.id)}>
                Usuń
              </button>
              {forwardOnlyStatus(s).map(status => (
                <button
                  key={status}
                  className="btn btn-sm btn-secondary"
                  onClick={() => onStatusChange(s, status)}
                >
                  Przenieś do {status}
                </button>
              ))}
              <button className="btn btn-sm btn-primary ms-2" onClick={() => setSelectedStoryId(s.id)}>
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
          <KanbanBoard storyId={selectedStoryId} key={refreshKanban} onTaskClick={setSelectedTask} />
        </div>
      )}
      {selectedTask && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <TaskDetails taskId={selectedTask.id} onClose={() => setSelectedTask(null)} onUpdated={() => { setSelectedTask(null); setRefreshKanban(r => r + 1); }} stories={stories} />
        </div>
      )}
    </div>
  );
};

export default StoryList;
