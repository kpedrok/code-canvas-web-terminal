
import React, { useEffect, useRef } from 'react';
import { TerminalOutput } from '@/lib/store';

interface TerminalHistoryProps {
  terminalHistory: TerminalOutput[];
}

export function TerminalHistory({ terminalHistory }: TerminalHistoryProps) {
  const historyRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when terminal output changes
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  return (
    <div 
      ref={historyRef}
      className="flex-1 p-4 overflow-y-auto"
    >
      {terminalHistory.map((item) => (
        <div key={item.id} className="mb-1">
          {item.type === 'command' ? (
            <div className="flex">
              <span className="text-primary mr-2">$</span>
              <span>{item.content}</span>
            </div>
          ) : item.type === 'error' ? (
            <div className="text-destructive whitespace-pre-wrap">{item.content}</div>
          ) : (
            <div className="whitespace-pre-wrap">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
