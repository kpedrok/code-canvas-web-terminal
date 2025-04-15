import { useFileStore, CodeFile } from './file-store'
import { useTerminalStore, TerminalOutput } from './terminal-store'

// Re-export types for backward compatibility
export type { CodeFile, TerminalOutput }

// Combined store for backward compatibility
export const useAppStore = {
  ...useFileStore,
  ...useTerminalStore,

  // Custom useState-like API that combines both stores
  use: (selector: (state: any) => any) => {
    // If selector is accessing file-related properties
    // Use this to determine which store to use based on property access
    // For simplicity, we're using both stores together
    const fileState = useFileStore(selector)
    const terminalState = useTerminalStore(selector)

    return { ...fileState, ...terminalState }
  },

  // Forward all state and methods from both stores
  getState: () => {
    return {
      ...useFileStore.getState(),
      ...useTerminalStore.getState(),
    }
  },

  setState: (newState: any) => {
    // Split state into file and terminal parts and update accordingly
    const { files, activeFileId, ...terminalPart } = newState

    if (files !== undefined || activeFileId !== undefined) {
      useFileStore.setState({ files, activeFileId })
    }

    useTerminalStore.setState(terminalPart)
  },
}
