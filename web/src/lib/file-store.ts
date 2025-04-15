import { create } from 'zustand'
import { generateId } from './utils'
import { useAuthStore } from './auth-store'
import { useProjectsStore } from './projects-store'

// API base URL - adjust if your backend is hosted elsewhere
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Types
export interface CodeFile {
  id: string
  name: string
  language: string
  content: string
}

interface FileState {
  files: CodeFile[]
  activeFileId: string | null
  addFile: (file: Omit<CodeFile, 'id'>, projectId: string) => Promise<void>
  updateFileContent: (id: string, content: string) => Promise<void>
  renameFile: (id: string, newName: string) => Promise<void>
  deleteFile: (id: string) => Promise<void>
  saveFile: (id: string) => Promise<void>
  setActiveFile: (id: string) => void
  fetchProjectFiles: (projectId: string) => Promise<void>
}

// Default Python code for new file
const DEFAULT_PYTHON_CODE = `# Welcome to CodeCanvas
# Try running this sample code

def greet(name):
    return f"Hello, {name}!"

# Test the function
message = greet("World")
print(message)

# Try more advanced features
for i in range(5):
    print(f"Count: {i}")
`

// Create file store
export const useFileStore = create<FileState>((set, get) => ({
  files: [
    {
      id: 'default-file',
      name: 'main.py',
      language: 'python',
      content: DEFAULT_PYTHON_CODE,
    },
  ],
  activeFileId: 'default-file',

  addFile: async (file, projectId) => {
    const newFileId = generateId()
    // Add file locally immediately for responsiveness
    set(state => ({
      files: [...state.files, { ...file, id: newFileId }],
    }))

    try {
      // Create file in backend
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: file.name,
          path: file.name, // Using filename as path for simplicity
          content: file.content,
          is_directory: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create file')
      }

      const savedFile = await response.json()
      // Update local file with server ID
      set(state => ({
        files: state.files.map(f => (f.id === newFileId ? { ...f, id: savedFile.id } : f)),
      }))
    } catch (error) {
      console.error('Error creating file:', error)
      // Keep the file in local state even if API call fails
    }
  },

  updateFileContent: async (id, content) => {
    // Update locally first for responsiveness
    set(state => ({
      files: state.files.map(file => (file.id === id ? { ...file, content } : file)),
    }))

    // Get the active project and file
    const file = get().files.find(f => f.id === id)
    if (!file) return

    try {
      // Update in backend
      const response = await fetch(`${API_BASE_URL}/api/files/${id}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        console.error('Failed to update file content')
      }
    } catch (error) {
      console.error('Error updating file content:', error)
    }
  },

  renameFile: async (id, newName) => {
    // Add .py extension if none provided
    const fileName = newName.includes('.') ? newName : `${newName}.py`

    // Update locally first for responsiveness
    set(state => ({
      files: state.files.map(file => (file.id === id ? { ...file, name: fileName } : file)),
    }))

    try {
      // Rename in backend
      const response = await fetch(`${API_BASE_URL}/api/files/${id}/rename`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: fileName }),
      })

      if (!response.ok) {
        console.error('Failed to rename file')
      }
    } catch (error) {
      console.error('Error renaming file:', error)
    }
  },

  deleteFile: async id => {
    // Get file before removing from state
    const fileToDelete = get().files.find(f => f.id === id)
    if (!fileToDelete) return

    // Update locally first for responsiveness
    const newFiles = get().files.filter(file => file.id !== id)
    const activeFileId = get().activeFileId === id ? (newFiles.length > 0 ? newFiles[0].id : null) : get().activeFileId

    set({
      files: newFiles,
      activeFileId,
    })

    try {
      // Delete in backend
      const response = await fetch(`${API_BASE_URL}/api/files/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        console.error('Failed to delete file')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  },

  saveFile: async id => {
    const file = get().files.find(f => f.id === id)
    if (!file) return

    try {
      // Save file content to backend
      const response = await fetch(`${API_BASE_URL}/api/files/${id}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: file.content }),
      })

      if (!response.ok) {
        console.error('Failed to save file')
      }

      console.log(`File saved: ${file.name}`)
    } catch (error) {
      console.error('Error saving file:', error)
    }
  },

  setActiveFile: id => set({ activeFileId: id }),

  fetchProjectFiles: async projectId => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/files`)

      if (!response.ok) {
        throw new Error('Failed to fetch project files')
      }

      const projectFiles = await response.json()

      // Transform API response to match our CodeFile format
      const files = projectFiles.map((apiFile: any) => ({
        id: apiFile.id,
        name: apiFile.name,
        language: apiFile.name.endsWith('.py')
          ? 'python'
          : apiFile.name.endsWith('.js')
            ? 'javascript'
            : apiFile.name.endsWith('.ts')
              ? 'typescript'
              : apiFile.name.endsWith('.html')
                ? 'html'
                : apiFile.name.endsWith('.css')
                  ? 'css'
                  : 'plaintext',
        content: apiFile.content || '',
      }))

      // If no files, provide a default one
      if (files.length === 0) {
        files.push({
          id: 'default-file',
          name: 'main.py',
          language: 'python',
          content: DEFAULT_PYTHON_CODE,
        })
      }

      set({
        files,
        activeFileId: files.length > 0 ? files[0].id : null,
      })
    } catch (error) {
      console.error('Error fetching project files:', error)

      // Fallback to default file if there's an error
      set({
        files: [
          {
            id: 'default-file',
            name: 'main.py',
            language: 'python',
            content: DEFAULT_PYTHON_CODE,
          },
        ],
        activeFileId: 'default-file',
      })
    }
  },
}))
