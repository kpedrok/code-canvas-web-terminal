import { Button } from '@/components/ui/button'
import { Code, Play } from 'lucide-react'
import { useFileStore } from '@/lib/file-store'
import { useTerminalStore } from '@/lib/terminal-store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function Header() {
  const { files, activeFileId } = useFileStore()
  const { executeCommand } = useTerminalStore()
  const activeFile = files.find(file => file.id === activeFileId)

  const handleRunCode = () => {
    if (activeFile) {
      executeCommand(`python ${activeFile.name}`)
    }
  }

  return (
    <div className='glass flex h-16 items-center border-b border-border/50 bg-background/50 px-6'>
      <div className='flex items-center'>
        <Code className='mr-2 h-6 w-6 text-primary' />
        <h1 className='text-gradient text-xl font-bold'>CodeCanvas</h1>
        <span className='ml-3 rounded bg-muted px-2 py-1 text-xs text-muted-foreground'>Python v3.11</span>
      </div>

      <div className='ml-auto flex items-center gap-3'>
        {activeFile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleRunCode}
                  className='hover-scale neon-border flex items-center'
                  variant='default'
                  size='sm'
                >
                  <Play className='mr-1 h-4 w-4' />
                  Run
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Execute the current file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}
