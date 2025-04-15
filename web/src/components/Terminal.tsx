import { useEffect, useRef } from 'react'
import { useTerminalStore } from '@/lib/terminal-store'
import { TerminalHeader } from './terminal/TerminalHeader'
import { TerminalHistory } from './terminal/TerminalHistory'
import { TerminalInput } from './terminal/TerminalInput'
import { Loader2 } from 'lucide-react'

interface TerminalProps {
  projectId?: string
}

export function Terminal({ projectId }: TerminalProps) {
  const {
    terminalHistory,
    currentCommand,
    isLoading,
    setCurrentCommand,
    executeCommand,
    initialize,
    disconnectWebSocket,
  } = useTerminalStore()

  const terminalRef = useRef<HTMLDivElement>(null)

  // Initialize WebSocket connection on component mount
  useEffect(() => {
    initialize(projectId)

    // Clean up the WebSocket connection when component unmounts
    return () => {
      disconnectWebSocket()
    }
  }, [initialize, disconnectWebSocket, projectId])

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    const inputs = terminalRef.current?.querySelectorAll('input')
    if (inputs && inputs.length > 0) {
      inputs[0].focus()
    }
  }

  // Handle command submission
  const handleSubmitCommand = (command: string) => {
    executeCommand(command)
  }

  return (
    <div
      ref={terminalRef}
      className='flex h-full w-full flex-col overflow-hidden bg-terminal font-mono text-sm text-terminal-foreground'
      onClick={handleTerminalClick}
    >
      <TerminalHeader />

      {isLoading && (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-terminal/80'>
          <div className='flex flex-col items-center space-y-3 rounded-lg bg-terminal-foreground/10 p-4 backdrop-blur-sm'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <p className='text-terminal-foreground'>Creating your terminal environment...</p>
            <p className='text-xs text-terminal-foreground/60'>This may take a few seconds</p>
          </div>
        </div>
      )}

      <TerminalHistory terminalHistory={terminalHistory} />

      <div className='px-4 pb-4'>
        <TerminalInput
          currentCommand={currentCommand}
          setCurrentCommand={setCurrentCommand}
          onSubmit={handleSubmitCommand}
        />
      </div>
    </div>
  )
}
