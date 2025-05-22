import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

import UserService from "./services/UserService";
import ProjectService, { Project } from "./services/ProjectService";
import StoryService, { Story } from "./services/StoryService";

import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";
import StoryForm from "./components/StoryForm";
import StoryList from "./components/StoryList";

import LoginForm from "./components/LoginForm";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const [stories, setStories] = useState<Story[]>([]);
  const [storyToEdit, setStoryToEdit] = useState<Story | undefined>();

  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Dark mode body class
  useEffect(() => {
    document.body.classList.toggle("bg-dark", darkMode);
    document.body.classList.toggle("text-light", darkMode);
  }, [darkMode]);

  // Fetch current user
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:4000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Nieautoryzowany");
        return res.json();
      })
      .then(data => setCurrentUser(data))
      .catch(() => {
        setToken(null);
        setCurrentUser(null);
      });
  }, [token]);

  // Initial load projects
  useEffect(() => {
    setProjects(ProjectService.getProjects());
  }, []);

  // Load stories on project change
  useEffect(() => {
    if (currentProject) {
      setStories(StoryService.getStories(currentProject.id));
    } else {
      setStories([]);
    }
  }, [currentProject]);

  // Handlers
  const refreshProjects = () => setProjects(ProjectService.getProjects());
  const refreshStories = () => currentProject && setStories(StoryService.getStories(currentProject.id));
  const resetProjectEdit = () => setProjectToEdit(undefined);
  const handleProjectEdited = (p: Project) => setProjectToEdit(p);
  const handleProjectSelected = (p: Project) => setCurrentProject(p);
  const resetStoryEdit = () => setStoryToEdit(undefined);
  const handleStoryEdit = (s: Story) => setStoryToEdit(s);

  const handleStorySaved = (
    s: Omit<Story, "id" | "createdAt" | "ownerId"> & { id?: number }
  ) => {
    if (!currentProject) return;
    if (s.id) {
      StoryService.updateStory(currentProject.id, {
        id: s.id,
        name: s.name,
        description: s.description,
        priority: s.priority,
        status: s.status,
        projectId: currentProject.id,
        createdAt: new Date().toISOString(),
        ownerId: UserService.getCurrentUser().id
      });
    } else {
      StoryService.addStory(currentProject.id, {
        name: s.name,
        description: s.description,
        priority: s.priority,
        status: s.status,
        projectId: currentProject.id
      });
    }
    refreshStories();
    resetStoryEdit();
  };

  const handleStoryDelete = (id: number) => {
    if (!currentProject) return;
    StoryService.deleteStory(currentProject.id, id);
    refreshStories();
  };

  const handleStatusChange = (story: Story, newStatus: "todo" | "doing" | "done") => {
    if (!currentProject) return;
    StoryService.updateStory(currentProject.id, { ...story, status: newStatus });
    refreshStories();
  };

  // If not logged in, show login form (with dark-mode toggle)
  if (!token) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <LoginForm onLoginSuccess={setToken} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      </div>
    );
  }

  // If token but still loading user
  if (!currentUser) {
    return <div className="text-center mt-5">Ładowanie danych użytkownika...</div>;
  }

  // Main app
  return (
    <div
      className={`app-container container py-4 ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
      style={{ maxWidth: "900px" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>
          {currentUser.firstName} {currentUser.lastName}
        </h1>
        <button
          className={`btn btn-sm btn-${darkMode ? "light" : "dark"}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "🌞 Jasny" : "🌙 Ciemny"}
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <ProjectForm onProjectAdded={refreshProjects} projectToEdit={projectToEdit} resetEdit={resetProjectEdit} />
          <ProjectList
            projects={projects}
            onProjectDeleted={refreshProjects}
            onProjectEdited={handleProjectEdited}
            onProjectSelected={handleProjectSelected}
          />
        </div>
      </div>

      {currentProject && (
        <div className="card">
          <div className="card-body">
            <h4 className="card-title mb-3">Aktywny Projekt: {currentProject.name}</h4>
            <button className="btn btn-outline-secondary mb-3" onClick={() => setCurrentProject(null)}>
              Odmapuj Projekt
            </button>
            <StoryForm
              storyToEdit={storyToEdit}
              onStorySaved={handleStorySaved}
              resetEdit={resetStoryEdit}
              projectId={currentProject.id}
            />
            <StoryList
              stories={stories}
              onEdit={handleStoryEdit}
              onDelete={handleStoryDelete}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
