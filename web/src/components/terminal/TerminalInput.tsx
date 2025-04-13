
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useCommandHistory } from './hooks/useCommandHistory';

interface TerminalInputProps {
  currentCommand: string;
  setCurrentCommand: (command: string) => void;
  onSubmit: (command: string) => void;
}

export function TerminalInput({ 
  currentCommand, 
  setCurrentCommand, 
  onSubmit 
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToHistory, navigateThroughHistory } = useCommandHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentCommand.trim()) {
      addToHistory(currentCommand);
      onSubmit(currentCommand);
      setCurrentCommand('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateThroughHistory('up', setCurrentCommand);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateThroughHistory('down', setCurrentCommand);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mt-2">
      <span className="text-primary mr-2">$</span>
      <input
        ref={inputRef}
        type="text"
        value={currentCommand}
        onChange={(e) => setCurrentCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex-1 bg-transparent outline-none",
          !currentCommand && "after:content-[''] after:terminal-cursor"
        )}
        autoFocus
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
    </form>
  );
}
