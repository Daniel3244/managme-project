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

const App = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const [stories, setStories] = useState<Story[]>([]);
  const [storyToEdit, setStoryToEdit] = useState<Story | undefined>();

  useEffect(() => {
    refreshProjects();
  }, []);

  useEffect(() => {
    if (currentProject) {
      refreshStories();
    } else {
      setStories([]);
    }
  }, [currentProject]);

  const refreshProjects = () => {
    setProjects(ProjectService.getProjects());
  };

  const refreshStories = () => {
    if (currentProject) {
      setStories(StoryService.getStories(currentProject.id));
    }
  };

  const resetProjectEdit = () => {
    setProjectToEdit(undefined);
  };

  const handleProjectEdited = (p: Project) => {
    setProjectToEdit(p);
  };

  const handleProjectSelected = (p: Project) => {
    setCurrentProject(p);
  };

  const resetStoryEdit = () => {
    setStoryToEdit(undefined);
  };

  const handleStoryEdit = (s: Story) => {
    setStoryToEdit(s);
  };

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

  const handleStatusChange = (
    story: Story,
    newStatus: "todo" | "doing" | "done"
  ) => {
    if (!currentProject) return;
    const updated = { ...story, status: newStatus };
    StoryService.updateStory(currentProject.id, updated);
    refreshStories();
  };

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
      <div className="text-center">
        <h1 className="mb-4">
          {UserService.getCurrentUser().firstName} {UserService.getCurrentUser().lastName}
        </h1>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <ProjectForm
            onProjectAdded={refreshProjects}
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
            <button
              className="btn btn-outline-secondary mb-3"
              onClick={() => setCurrentProject(null)}
            >
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
