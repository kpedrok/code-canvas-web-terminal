import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './auth-store';

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  files: {
    id: string;
    name: string;
    language: string;
    content: string;
  }[];
  createdAt: string;
  updatedAt: string;
  maxRuntime?: number;
}

interface ProjectsState {
  projects: Project[];
  activeProject: Project | null;
  createProject: (name: string, description: string) => void;
  getProjects: () => Project[];
  getProject: (id: string) => Project | undefined;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProject: null,
      
      createProject: (name: string, description: string) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        const newProject: Project = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          description,
          userId: user.id,
          files: [
            {
              id: 'default-file',
              name: 'main.py',
              language: 'python',
              content: '# Welcome to your new project\n\nprint("Hello, World!")',
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          maxRuntime: 10, // Default max runtime in seconds
        };
        
        set((state) => ({ 
          projects: [...state.projects, newProject],
          activeProject: newProject
        }));
      },
      
      getProjects: () => {
        const user = useAuthStore.getState().user;
        if (!user) return [];
        
        return get().projects.filter(project => project.userId === user.id);
      },
      
      getProject: (id: string) => {
        const user = useAuthStore.getState().user;
        if (!user) return undefined;
        
        return get().projects.find(
          project => project.id === id && project.userId === user.id
        );
      },
      
      updateProject: (id: string, data: Partial<Project>) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set((state) => ({
          projects: state.projects.map(project => 
            project.id === id && project.userId === user.id
              ? { ...project, ...data, updatedAt: new Date().toISOString() }
              : project
          ),
          activeProject: state.activeProject?.id === id 
            ? { ...state.activeProject, ...data, updatedAt: new Date().toISOString() } 
            : state.activeProject
        }));
      },
      
      deleteProject: (id: string) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set((state) => ({
          projects: state.projects.filter(
            project => !(project.id === id && project.userId === user.id)
          ),
          activeProject: state.activeProject?.id === id ? null : state.activeProject
        }));
      },
      
      setActiveProject: (id: string) => {
        const project = get().getProject(id);
        if (project) {
          set({ activeProject: project });
        }
      }
    }),
    {
      name: 'projects-store',
    }
  )
);
