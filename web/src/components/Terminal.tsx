import { useEffect, useRef } from 'react'
import { useTerminalStore } from '@/lib/terminal-store'
import { TerminalHeader } from './terminal/TerminalHeader'
import { TerminalHistory } from './terminal/TerminalHistory'
import { TerminalInput } from './terminal/TerminalInput'

export function Terminal() {
  const {
    terminalHistory,
    currentCommand,
    setCurrentCommand,
    executeCommand,
    initialize,
    disconnectWebSocket,
  } = useTerminalStore()

  const terminalRef = useRef<HTMLDivElement>(null)

  // Initialize WebSocket connection on component mount
  useEffect(() => {
    initialize()

    // Clean up the WebSocket connection when component unmounts
    return () => {
      disconnectWebSocket()
    }
  }, [initialize, disconnectWebSocket])

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
      className='w-full h-full flex flex-col bg-terminal text-terminal-foreground font-mono text-sm overflow-hidden'
      onClick={handleTerminalClick}
    >
      <TerminalHeader />

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
