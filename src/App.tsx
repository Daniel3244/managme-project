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
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.toggle("bg-dark", darkMode);
    document.body.classList.toggle("text-light", darkMode);
  }, [darkMode]);

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

  useEffect(() => {
    ProjectService.getProjects().then(setProjects)
  }, [])

  useEffect(() => {
    if (currentProject) {
      StoryService.getStories(currentProject.id).then(setStories)
    } else {
      setStories([])
    }
  }, [currentProject])

  const refreshProjects = () => ProjectService.getProjects().then(setProjects)
  const refreshStories = () => currentProject && StoryService.getStories(currentProject.id).then(setStories)
  const resetProjectEdit = () => setProjectToEdit(undefined);
  const handleProjectEdited = (p: Project) => setProjectToEdit(p);
  const handleProjectSelected = (p: Project) => setCurrentProject(p);
  const resetStoryEdit = () => setStoryToEdit(undefined);
  const handleStoryEdit = (s: Story) => setStoryToEdit(s);

  const handleStorySaved = async (
    s: Omit<Story, "id" | "createdAt" | "ownerId"> & { id?: string; createdAt?: string; ownerId?: string }
  ) => {
    if (!currentProject) return;
    if (s.id) {
      await StoryService.updateStory(currentProject.id, {
        ...s,
        id: s.id,
        projectId: currentProject.id,
        createdAt: s.createdAt,
        ownerId: s.ownerId || currentUser.id
      });
    } else {
      await StoryService.addStory(currentProject.id, {
        ...s,
        projectId: currentProject.id,
        createdAt: new Date().toISOString(),
        ownerId: currentUser.id
      });
    }
    refreshStories();
    resetStoryEdit();
  };

  const handleStoryDelete = async (id: string) => {
    if (!currentProject) return;
    await StoryService.deleteStory(currentProject.id, id);
    refreshStories();
  };

  const handleStatusChange = async (story: Story, newStatus: "todo" | "doing" | "done") => {
    if (!currentProject) return;
    await StoryService.updateStory(currentProject.id, {
      ...story,
      status: newStatus
    });
    refreshStories();
  };

  const handleProjectSaved = async (project: Omit<Project, "id">) => {
    await ProjectService.addProject(project)
    refreshProjects()
    resetProjectEdit()
  }

  if (!token) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <LoginForm onLoginSuccess={setToken} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      </div>
    );
  }

  if (!currentUser) {
    return <div className="text-center mt-5">Ładowanie danych użytkownika...</div>;
  }

  return (
    <div
      className={`app-container container py-4 ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
      style={{ maxWidth: "900px" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <div className="user-avatar">
            {currentUser.firstName[0]}{currentUser.lastName[0]}
          </div>
          <h1 className="mb-0" style={{ fontSize: "2rem", fontWeight: 700 }}>
            {currentUser.firstName} {currentUser.lastName}
          </h1>
        </div>
        <button
          className={`btn btn-sm btn-${darkMode ? "light" : "dark"}`}
          style={{ minWidth: 90, fontWeight: 600 }}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <span role="img" aria-label="jasny">🌞 Jasny</span> : <span role="img" aria-label="ciemny">🌙 Ciemny</span>}
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <ProjectForm
            onProjectAdded={handleProjectSaved}
            projectToEdit={projectToEdit}
            resetEdit={resetProjectEdit}
          />
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
            <button className="btn btn-outline-secondary mb-3 me-2" onClick={() => setCurrentProject(null)}>
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
              currentUser={currentUser}
              selectedStoryId={selectedStoryId}
              setSelectedStoryId={setSelectedStoryId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
