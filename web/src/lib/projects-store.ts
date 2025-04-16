import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './auth-store'

// API base URL - adjust if your backend is hosted elsewhere
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface Project {
  id: string
  name: string
  description: string
  userId: string
  files: {
    id: string
    name: string
    language: string
    content: string
  }[]
  createdAt: string
  updatedAt: string
  maxRuntime?: number
}

interface ProjectsState {
  projects: Project[]
  activeProject: Project | null
  loading: boolean
  error: string | null
  createProject: (name: string, description: string) => Promise<void>
  fetchProjects: () => Promise<Project[]>
  getProjects: () => Project[]
  getProject: (id: string) => Project | undefined
  fetchProject: (id: string) => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => void
  deleteProject: (id: string) => Promise<void>
  setActiveProject: (id: string) => void
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProject: null,
      loading: false,
      error: null,

      createProject: async (name: string, description: string) => {
        const { user, getAuthHeaders } = useAuthStore.getState()
        if (!user) return

        set({ loading: true, error: null })

        try {
          const response = await fetch(`${API_BASE_URL}/api/projects`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify({ name, description }),
          })

          if (!response.ok) {
            throw new Error('Failed to create project')
          }

          const projectData = await response.json()

          const newProject: Project = {
            id: projectData.id,
            name: projectData.name,
            description: projectData.description,
            userId: user.id,
            files: [
              {
                id: 'default-file',
                name: 'main.py',
                language: 'python',
                content: '# Welcome to your new project\n\nprint("Hello, World!")',
              },
            ],
            createdAt: projectData.created_at || new Date().toISOString(),
            updatedAt: projectData.updated_at || new Date().toISOString(),
            maxRuntime: 10,
          }

          set(state => ({
            projects: [...state.projects, newProject],
            activeProject: newProject,
            loading: false,
          }))
        } catch (error) {
          console.error('Error creating project:', error)
          set({ error: 'Failed to create project', loading: false })
        }
      },

      fetchProjects: async () => {
        const { user, getAuthHeaders } = useAuthStore.getState()
        if (!user) return

        set({ loading: true, error: null })

        try {
          // Use the new authenticated endpoint
          const response = await fetch(`${API_BASE_URL}/api/projects`, {
            headers: getAuthHeaders(),
          })

          if (!response.ok) {
            throw new Error('Failed to fetch projects')
          }

          const projects = await response.json()

          // Map the API response to our Project interface
          const fetchedProjects = projects.map((project: any) => ({
            id: project.id,
            name: project.name,
            description: project.description || '',
            userId: user.id,
            files: [], // We'll load files on demand when opening a project
            createdAt: project.created_at || new Date().toISOString(),
            updatedAt: project.updated_at || new Date().toISOString(),
            maxRuntime: 10,
          }))

          set({
            projects: fetchedProjects,
            loading: false,
          })
          return fetchedProjects
        } catch (error) {
          console.error('Error fetching projects:', error)
          set({ error: 'Failed to fetch projects', loading: false })
        }
      },

      getProjects: () => {
        const user = useAuthStore.getState().user
        if (!user) return []

        return get().projects.filter(project => project.userId === user.id)
      },

      getProject: (id: string) => {
        const user = useAuthStore.getState().user
        if (!user) return undefined

        return get().projects.find(project => project.id === id && project.userId === user.id)
      },

      fetchProject: async (id: string) => {
        const { user, getAuthHeaders } = useAuthStore.getState()
        if (!user) return

        set({ loading: true, error: null })

        try {
          // Use the new authenticated endpoint
          const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
            headers: getAuthHeaders(),
          })

          if (!response.ok) {
            throw new Error('Failed to fetch project details')
          }

          const projectData = await response.json()

          set(state => {
            const existingProjectIndex = state.projects.findIndex(p => p.id === id)

            const updatedProject: Project = {
              id: projectData.id,
              name: projectData.name,
              description: projectData.description || '',
              userId: user.id,
              files: state.projects[existingProjectIndex]?.files || [],
              createdAt: projectData.created_at || new Date().toISOString(),
              updatedAt: projectData.updated_at || new Date().toISOString(),
              maxRuntime: 10,
            }

            const updatedProjects = [...state.projects]

            if (existingProjectIndex >= 0) {
              updatedProjects[existingProjectIndex] = updatedProject
            } else {
              updatedProjects.push(updatedProject)
            }

            return {
              projects: updatedProjects,
              activeProject: updatedProject,
              loading: false,
            }
          })
        } catch (error) {
          console.error('Error fetching project details:', error)
          set({ error: 'Failed to fetch project details', loading: false })
        }
      },

      updateProject: (id: string, data: Partial<Project>) => {
        const user = useAuthStore.getState().user
        if (!user) return

        set(state => ({
          projects: state.projects.map(project =>
            project.id === id && project.userId === user.id
              ? { ...project, ...data, updatedAt: new Date().toISOString() }
              : project
          ),
          activeProject:
            state.activeProject?.id === id
              ? { ...state.activeProject, ...data, updatedAt: new Date().toISOString() }
              : state.activeProject,
        }))
      },

      deleteProject: async (id: string) => {
        const { user, getAuthHeaders } = useAuthStore.getState()
        if (!user) return

        set({ loading: true, error: null })

        try {
          const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          })

          if (!response.ok) {
            throw new Error('Failed to delete project')
          }

          set(state => ({
            projects: state.projects.filter(project => project.id !== id),
            activeProject: state.activeProject?.id === id ? null : state.activeProject,
            loading: false,
          }))
        } catch (error) {
          console.error('Error deleting project:', error)
          set({ error: 'Failed to delete project', loading: false })
        }
      },

      setActiveProject: (id: string) => {
        const project = get().getProject(id)
        if (project) {
          set({ activeProject: project })
        }
      },
    }),
    {
      name: 'projects-store',
    }
  )
)
