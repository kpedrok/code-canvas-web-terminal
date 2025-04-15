import { FolderOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileSidebarHeaderProps {
  onCreateFile: () => void
}

export function FileSidebarHeader({ onCreateFile }: FileSidebarHeaderProps) {
  return (
    <>
      <div className='flex items-center justify-between border-b border-border p-4'>
        <h2 className='text-sm font-semibold'>Explorer</h2>
        <Button variant='ghost' size='icon' onClick={onCreateFile} className='h-6 w-6'>
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      <div className='mb-2 flex items-center px-4 py-1 text-xs font-semibold text-sidebar-foreground/70'>
        <FolderOpen className='mr-1 h-4 w-4' />
        PROJECT FILES
      </div>
    </>
  )
}
