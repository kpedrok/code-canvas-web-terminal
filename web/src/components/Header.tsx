
import { Button } from '@/components/ui/button';
import { Code, Play } from 'lucide-react';
import { useFileStore } from '@/lib/file-store';
import { useTerminalStore } from '@/lib/terminal-store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Header() {
  const { files, activeFileId } = useFileStore();
  const { executeCommand } = useTerminalStore();
  const activeFile = files.find(file => file.id === activeFileId);
  
  const handleRunCode = () => {
    if (activeFile) {
      executeCommand(`python ${activeFile.name}`);
    }
  };

  return (
    <div className="h-16 border-b border-border/50 glass flex items-center px-6 bg-background/50">
      <div className="flex items-center">
        <Code className="h-6 w-6 text-primary mr-2" />
        <h1 className="text-xl font-bold text-gradient">
          CodeCanvas
        </h1>
        <span className="text-xs ml-3 px-2 py-1 rounded bg-muted text-muted-foreground">
          Python v3.11
        </span>
      </div>
      
      <div className="ml-auto flex items-center gap-3">
        {activeFile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleRunCode}
                  className="flex items-center hover-scale neon-border"
                  variant="default"
                  size="sm"
                >
                  <Play className="mr-1 h-4 w-4" />
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
  );
}
