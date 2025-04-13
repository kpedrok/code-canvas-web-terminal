
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from './utils';
import { useFileStore } from './file-store';

// Types
export interface TerminalOutput {
  id: string;
  content: string;
  type: 'command' | 'output' | 'error';
}

interface TerminalState {
  terminalHistory: TerminalOutput[];
  currentCommand: string;
  setCurrentCommand: (command: string) => void;
  addTerminalOutput: (output: Omit<TerminalOutput, 'id'>) => void;
  clearTerminal: () => void;
  executeCommand: (command: string, isTermination?: boolean) => void;
}

// Create terminal store
export const useTerminalStore = create<TerminalState>((set, get) => ({
  terminalHistory: [],
  currentCommand: '',
  
  setCurrentCommand: (command) => set({ currentCommand: command }),
  
  addTerminalOutput: (output) => set((state) => ({ 
    terminalHistory: [...state.terminalHistory, { ...output, id: generateId() }]
  })),
  
  clearTerminal: () => set({ terminalHistory: [] }),
  
  executeCommand: (command, isTermination = false) => {
    const { addTerminalOutput } = get();
    
    // If this is a termination signal, show termination message
    if (isTermination) {
      addTerminalOutput({
        content: "Process terminated due to timeout.",
        type: 'error',
      });
      return;
    }
    
    // Add the command to terminal history
    if (command) {
      addTerminalOutput({
        content: command,
        type: 'command',
      });
    }
    
    // Import file store only when needed to avoid circular dependencies
    const { files } = useFileStore.getState();
    
    // Simulate processing time
    setTimeout(() => {
      // Handle Python script execution
      if (command.startsWith('python ')) {
        const filename = command.split(' ')[1];
        const file = files.find(f => f.name === filename);
        
        if (file) {
          // In a real app, this would send the code to the backend
          // For now, we'll simulate a simple Python output
          
          // For main.py, show the default output
          if (filename === 'main.py') {
            addTerminalOutput({
              content: 'Hello, World!',
              type: 'output',
            });
            addTerminalOutput({
              content: 'Count: 0\nCount: 1\nCount: 2\nCount: 3\nCount: 4',
              type: 'output',
            });
          } else {
            addTerminalOutput({
              content: `Executing ${filename}...\nOutput would appear here`,
              type: 'output', 
            });
          }
        } else {
          addTerminalOutput({
            content: `Error: File ${filename} not found`,
            type: 'error',
          });
        }
      } 
      // Handle pip install
      else if (command.startsWith('pip install ')) {
        const packageName = command.split('pip install ')[1];
        addTerminalOutput({
          content: `Installing ${packageName}...\nSuccessfully installed ${packageName}`,
          type: 'output',
        });
      }
      // Handle clear command
      else if (command === 'clear' || command === 'cls') {
        set({ terminalHistory: [] });
      }
      // Handle ls command
      else if (command === 'ls' || command === 'dir') {
        const { files } = useFileStore.getState();
        const fileList = files.map(f => f.name).join('\n');
        addTerminalOutput({
          content: fileList || 'No files found',
          type: 'output',
        });
      }
      // Handle help command
      else if (command === 'help') {
        addTerminalOutput({
          content: `Available commands:
- python <filename> - Run a Python script
- pip install <package> - Install a Python package
- ls/dir - List files
- clear/cls - Clear terminal
- help - Show this help message`,
          type: 'output',
        });
      }
      // Unknown command
      else if (command) {
        addTerminalOutput({
          content: `Command not recognized: ${command}\nType 'help' to see available commands`,
          type: 'error',
        });
      }
    }, 300);
  },
}));
