import { useState } from "react";
import { Story } from "../services/StoryService";

interface Props {
  stories: Story[];
  onEdit: (s: Story) => void;
  onDelete: (id: string) => void;
  onStatusChange: (s: Story, newStatus: "todo" | "doing" | "done") => void;
  currentUser: { id: string; firstName: string; lastName: string };
}

const StoryList: React.FC<Props> = ({ stories, onEdit, onDelete, onStatusChange, currentUser }) => {
  const [filter, setFilter] = useState<"all" | "todo" | "doing" | "done">("all");
  const filteredStories =
    filter === "all" ? stories : stories.filter(s => s.status === filter);
  const forwardOnlyStatus = (s: Story): ("todo" | "doing" | "done")[] => {
    if (s.status === "todo") return ["doing"];
    if (s.status === "doing") return ["done"];
    return [];
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
