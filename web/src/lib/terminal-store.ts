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
  isLoading: boolean;
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
  isLoading: false,
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

    // Set loading state
    set({ isLoading: true });

    // Use a direct WebSocket URL for local development
    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
    set({ webSocket: ws });
    
    addTerminalOutput({
      content: `Connecting to server at ws://localhost:8000/ws/${userId}...`,
      type: 'output',
    });
    
    ws.onopen = () => {
      set({ connected: true, isLoading: false });
      addTerminalOutput({
        content: 'Connected to terminal server.',
        type: 'output',
      });
    };
    
    ws.onclose = () => {
      set({ connected: false });
      
      // Only show reconnection message if we're not in loading state
      if (!get().isLoading) {
        addTerminalOutput({
          content: 'Connection closed. Attempting to reconnect...',
          type: 'error',
        });
        
        // Try to reconnect after a short delay
        setTimeout(() => {
          if (!get().connected) {
            get().connectWebSocket();
          }
        }, 3000);
      }
    };
    
    ws.onerror = (error) => {
      // Don't update error state immediately, give it time to connect
      // Container creation might take a few seconds
      
      // If we're not already in a loading state, show an error
      if (!get().isLoading) {
        set({ connected: false });
        addTerminalOutput({
          content: 'WebSocket error: Unable to connect to the backend server. Make sure uvicorn is running.',
          type: 'error',
        });
      }
      
      // Either way, attempt to reconnect automatically
      setTimeout(() => {
        if (!get().connected) {
          get().connectWebSocket();
        }
      }, 3000);
    };
    
    ws.onmessage = (event) => {
      // If we get a message, we're definitely connected
      if (get().isLoading) {
        set({ isLoading: false });
      }
      
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
