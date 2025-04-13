
import { create } from 'zustand';
import { generateId } from './utils';

// Types
export interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

interface FileState {
  files: CodeFile[];
  activeFileId: string | null;
  addFile: (file: Omit<CodeFile, 'id'>) => void;
  updateFileContent: (id: string, content: string) => void;
  renameFile: (id: string, newName: string) => void;
  deleteFile: (id: string) => void;
  saveFile: (id: string) => void;
  setActiveFile: (id: string) => void;
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
`;

// Create file store
export const useFileStore = create<FileState>((set, get) => ({
  files: [
    {
      id: 'default-file',
      name: 'main.py',
      language: 'python',
      content: DEFAULT_PYTHON_CODE,
    }
  ],
  activeFileId: 'default-file',
  
  addFile: (file) => set((state) => ({ 
    files: [...state.files, { ...file, id: generateId() }]
  })),
  
  updateFileContent: (id, content) => set((state) => ({
    files: state.files.map(file => 
      file.id === id ? { ...file, content } : file
    ),
  })),
  
  renameFile: (id, newName) => set((state) => {
    // Add .py extension if none provided
    const fileName = newName.includes('.') ? newName : `${newName}.py`;
    
    return {
      files: state.files.map(file => 
        file.id === id ? { ...file, name: fileName } : file
      ),
    };
  }),
  
  deleteFile: (id) => set((state) => {
    const newFiles = state.files.filter(file => file.id !== id);
    const activeFileId = state.activeFileId === id 
      ? (newFiles.length > 0 ? newFiles[0].id : null)
      : state.activeFileId;
      
    return {
      files: newFiles,
      activeFileId
    };
  }),
  
  saveFile: (id) => {
    // In a real app, this would save to a backend
    // For now we'll just simulate a save with a console log
    const file = get().files.find(f => f.id === id);
    if (file) {
      console.log(`File saved: ${file.name}`);
    }
  },
  
  setActiveFile: (id) => set({ activeFileId: id }),
}));
