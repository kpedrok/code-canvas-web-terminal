
import { useState } from 'react';

export function useCommandHistory() {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = (command: string) => {
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
    }
  };

  const navigateThroughHistory = (
    direction: 'up' | 'down',
    setCurrentCommand: (command: string) => void
  ): void => {
    if (direction === 'up') {
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (direction === 'down') {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  return {
    commandHistory,
    historyIndex,
    addToHistory,
    navigateThroughHistory
  };
}
