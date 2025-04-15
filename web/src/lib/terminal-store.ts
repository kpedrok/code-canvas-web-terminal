import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from './utils';
import { useFileStore } from './file-store';
import { useProjectsStore } from './projects-store';
import { useAuthStore } from './auth-store';

// API base URL - adjust if your backend is hosted elsewhere
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  projectId: string;
  setCurrentCommand: (command: string) => void;
  setProjectId: (projectId: string) => void;
  addTerminalOutput: (output: Omit<TerminalOutput, 'id'>) => void;
  clearTerminal: () => void;
  executeCommand: (command: string, forceTerminate?: boolean) => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  initialize: (projectId?: string) => void;
}

// Create terminal store
export const useTerminalStore = create<TerminalState>((set, get) => ({
  terminalHistory: [],
  currentCommand: '',
  connected: false,
  isLoading: false,
  webSocket: null,
  projectId: 'default',
  
  setCurrentCommand: (command) => set({ currentCommand: command }),
  
  setProjectId: (projectId) => {
    set({ projectId });
    // If already connected, reconnect with the new project ID
    if (get().connected) {
      get().disconnectWebSocket();
      get().connectWebSocket();
    }
  },
  
  addTerminalOutput: (output) => set((state) => ({ 
    terminalHistory: [...state.terminalHistory, { ...output, id: generateId() }]
  })),
  
  clearTerminal: () => set({ terminalHistory: [] }),

  initialize: (projectId) => {
    // Get the authenticated user
    const { user, isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated || !user) {
      // If not authenticated, add error message to terminal
      set({ 
        terminalHistory: [{
          id: generateId(),
          content: 'Authentication required. Please log in to use the terminal.',
          type: 'error'
        }]
      });
      return;
    }
    
    // If projectId is provided, use it; otherwise, try to get the active project ID
    // or use the default project ID
    let currentProjectId = projectId;
    if (!currentProjectId) {
      const activeProject = useProjectsStore.getState().activeProject;
      currentProjectId = activeProject?.id || 'default';
    }
    
    set({ projectId: currentProjectId });
    get().connectWebSocket();
  },
  
  connectWebSocket: () => {
    const { projectId, addTerminalOutput } = get();
    const { user, getAuthHeaders, isAuthenticated } = useAuthStore.getState();
    
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      addTerminalOutput({
        content: 'Authentication required. Please log in to use the terminal.',
        type: 'error',
      });
      return;
    }

    // Close existing connection if any
    if (get().webSocket) {
      get().webSocket!.close();
    }

    // Set loading state
    set({ isLoading: true });

    // Use WebSocket URL with authenticated user ID
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsBaseUrl = API_BASE_URL.replace(/^https?:\/\//, `${wsProtocol}//`);
    
    // Create WebSocket connection with authentication token in query param
    const token = useAuthStore.getState().token;
    const ws = new WebSocket(`${wsBaseUrl}/ws/${user.id}/${projectId}?token=${token}`);
    
    set({ webSocket: ws });
    
    addTerminalOutput({
      content: `Connecting to terminal for project ${projectId}...`,
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
  
  executeCommand: (command, forceTerminate = false) => {
    const { addTerminalOutput, webSocket, connected } = get();
    
    // Add the command to terminal history if it's a normal command (not a forced termination)
    if (command && !forceTerminate) {
      addTerminalOutput({
        content: command,
        type: 'command',
      });
    }
    
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
  },
}));
