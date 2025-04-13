
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileSidebarHeaderProps {
  onCreateFile: () => void;
}

export function FileSidebarHeader({ onCreateFile }: FileSidebarHeaderProps) {
  return (
    <>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-sm">Explorer</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCreateFile}
          className="h-6 w-6"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-2 flex items-center px-4 py-1 text-xs font-semibold text-sidebar-foreground/70">
        <FolderOpen className="h-4 w-4 mr-1" />
        PROJECT FILES
      </div>
    </>
  );
}
