import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import ProjectService, { Project } from "./services/ProjectService";
import StoryService, { Story } from "./services/StoryService";

import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";
import StoryForm from "./components/StoryForm";
import StoryList from "./components/StoryList";

import LoginForm from "./components/LoginForm";

const App = () => {
  // State for dark mode, projects, stories, user, etc.
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
    // Toggle dark mode classes on body
    document.body.classList.toggle("bg-dark", darkMode);
    document.body.classList.toggle("text-light", darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Fetch current user info after login
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
    // Fetch all projects on mount
    ProjectService.getProjects().then(setProjects)
  }, [])

  useEffect(() => {
    // Fetch stories for selected project or reset if none
    if (currentProject) {
      StoryService.getStories(currentProject.id).then(setStories)
    } else {
      setStories([])
      setSelectedStoryId(null); // Reset selected story if project is removed
      setStoryToEdit(undefined); // Reset story edit form if project is removed
    }
  }, [currentProject])

  useEffect(() => {
    // If selectedStoryId is not present in stories, reset selection and edit form
    if (selectedStoryId && !stories.find(s => s.id === selectedStoryId)) {
      setSelectedStoryId(null);
      setStoryToEdit(undefined);
    }
  }, [stories, selectedStoryId]);

  useEffect(() => {
    // If there are no projects, reset everything
    if (projects.length === 0) {
      setCurrentProject(null);
      setStories([]);
      setSelectedStoryId(null);
      setStoryToEdit(undefined);
    }
  }, [projects]);

  // Helper functions for refreshing and resetting state
  const refreshProjects = () => ProjectService.getProjects().then(setProjects)
  const refreshStories = () => currentProject && StoryService.getStories(currentProject.id).then(setStories)
  const resetProjectEdit = () => setProjectToEdit(undefined);
  const handleProjectEdited = (p: Project) => setProjectToEdit(p);
  const handleProjectSelected = (p: Project) => {
    setCurrentProject(p);
    setSelectedStoryId(null); // Reset selected story when project changes
    setStoryToEdit(undefined); // Reset story edit form
  };
  const resetStoryEdit = () => setStoryToEdit(undefined);
  const handleStoryEdit = (s: Story) => setStoryToEdit(s);

  const handleStorySaved = async (
    s: Omit<Story, "id" | "createdAt" | "ownerId"> & { id?: string; createdAt?: string; ownerId?: string }
  ) => {
    // Add or update a story, always set createdAt and ownerId
    if (!currentProject) return;
    if (s.id) {
      await StoryService.updateStory(currentProject.id, {
        ...s,
        id: s.id,
        projectId: currentProject.id,
        createdAt: s.createdAt || new Date().toISOString(),
        ownerId: s.ownerId || currentUser.id
      });
      await refreshStories();
    } else {
      await StoryService.addStory(currentProject.id, {
        ...s,
        projectId: currentProject.id,
        createdAt: new Date().toISOString(),
        ownerId: currentUser.id
      });
      await refreshStories();
    }
    resetStoryEdit();
    setSelectedStoryId(null); // Reset mapped story after save
  };

  const handleStoryDelete = async (id: string) => {
    if (!currentProject) return;
    await StoryService.deleteStory(currentProject.id, id);
    refreshStories();
    setSelectedStoryId(null); // Reset mapped story after delete
    setStoryToEdit(undefined); // Reset story edit form
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
    setCurrentProject(null); // Reset mapped project after add
    setSelectedStoryId(null); // Reset mapped story
  }

  const handleProjectUpdated = async (project: Project) => {
    await ProjectService.updateProject(project);
    refreshProjects();
    resetProjectEdit();
    setCurrentProject(null); // Reset mapped project after update
    setSelectedStoryId(null); // Reset mapped story
  };

  if (!token) {
    // Show login form if not logged in
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <LoginForm onLoginSuccess={setToken} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      </div>
    );
  }

  if (!currentUser) {
    // Show loading if user data is not loaded
    return <div className="text-center mt-5">Ładowanie danych użytkownika...</div>;
  }

  return (
    // Main app UI: user info, project form/list, story form/list
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
            onProjectUpdated={handleProjectUpdated}
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
