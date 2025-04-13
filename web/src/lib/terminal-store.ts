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
  connected: boolean;
  webSocket: WebSocket | null;
  userId: string;
  setCurrentCommand: (command: string) => void;
  addTerminalOutput: (output: Omit<TerminalOutput, 'id'>) => void;
  clearTerminal: () => void;
  executeCommand: (command: string) => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  initialize: () => void;
}

// Create terminal store
export const useTerminalStore = create<TerminalState>((set, get) => ({
  terminalHistory: [],
  currentCommand: '',
  connected: false,
  webSocket: null,
  userId: '',
  
  setCurrentCommand: (command) => set({ currentCommand: command }),
  
  addTerminalOutput: (output) => set((state) => ({ 
    terminalHistory: [...state.terminalHistory, { ...output, id: generateId() }]
  })),
  
  clearTerminal: () => set({ terminalHistory: [] }),

  initialize: () => {
    // Generate a random user ID if not present
    const userId = localStorage.getItem('userId') || `user_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('userId', userId);
    set({ userId });
    get().connectWebSocket();
  },
  
  connectWebSocket: () => {
    const { userId, addTerminalOutput } = get();
    
    // Close existing connection if any
    if (get().webSocket) {
      get().webSocket!.close();
    }

    // Use a direct WebSocket URL for local development
    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
    set({ webSocket: ws });
    
    addTerminalOutput({
      content: `Connecting to server at ws://localhost:8000/ws/${userId}...`,
      type: 'output',
    });
    
    ws.onopen = () => {
      set({ connected: true });
      addTerminalOutput({
        content: 'Connected to terminal server.',
        type: 'output',
      });
    };
    
    ws.onclose = () => {
      set({ connected: false });
      addTerminalOutput({
        content: 'Connection closed. Refresh to reconnect.',
        type: 'error',
      });
    };
    
    ws.onerror = (error) => {
      set({ connected: false });
      addTerminalOutput({
        content: 'WebSocket error: Unable to connect to the backend server. Make sure uvicorn is running.',
        type: 'error',
      });
      addTerminalOutput({
        content: 'Run this command in your terminal: uvicorn main:app --reload',
        type: 'error',
      });
    };
    
    ws.onmessage = (event) => {
      addTerminalOutput({
        content: event.data,
        type: 'output',
      });
    };
  },
  
  disconnectWebSocket: () => {
    const { webSocket } = get();
    if (webSocket) {
      webSocket.close();
      set({ webSocket: null, connected: false });
    }
  },
  
  executeCommand: (command) => {
    const { addTerminalOutput, webSocket, connected } = get();
    
    // Add the command to terminal history
    if (command) {
      addTerminalOutput({
        content: command,
        type: 'command',
      });
      
      // If connected to websocket, send command
      if (connected && webSocket) {
        webSocket.send(command);
      } else {
        // If not connected, show error
        addTerminalOutput({
          content: 'Not connected to server. Try refreshing the page.',
          type: 'error',
        });
      }
    }
  },
}));
