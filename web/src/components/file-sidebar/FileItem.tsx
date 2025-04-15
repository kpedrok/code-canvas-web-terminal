import { File, Edit, Save, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface FileItemProps {
  id: string
  name: string
  isActive: boolean
  onFileClick: (id: string) => void
  onSave: (id: string, name: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string, name: string) => void
}

export function FileItem({ id, name, isActive, onFileClick, onSave, onRename, onDelete }: FileItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingName, setEditingName] = useState('')
  const { toast } = useToast()

  const startRename = () => {
    setIsEditing(true)
    // Remove extension for easier editing
    const baseName = name.includes('.') ? name.substring(0, name.lastIndexOf('.')) : name
    setEditingName(baseName)
  }

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingName.trim()) {
      // Get original extension
      const extension = name.includes('.') ? name.substring(name.lastIndexOf('.')) : '.py'

      const newName = editingName.includes('.') ? editingName : `${editingName}${extension}`

      onRename(id, newName)
      toast({
        title: 'File renamed',
        description: `File has been renamed to ${newName}.`,
      })
    }

    setIsEditing(false)
    setEditingName('')
  }

  if (isEditing) {
    return (
      <form onSubmit={handleRenameSubmit} className='flex items-center px-2 py-1'>
        <File className='mr-2 h-4 w-4 text-sidebar-foreground/70' />
        <input
          type='text'
          value={editingName}
          onChange={e => setEditingName(e.target.value)}
          className='flex-1 rounded bg-sidebar-accent px-1 text-sm outline-none'
          autoFocus
          onBlur={handleRenameSubmit}
        />
      </form>
    )
  }

  return (
    <div className='flex w-full items-center'>
      <button
        onClick={() => onFileClick(id)}
        className={cn(
          'flex flex-1 items-center rounded px-2 py-1 text-sm',
          isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        )}
      >
        <File className='mr-2 h-4 w-4 text-sidebar-foreground/70' />
        {name}
      </button>

      <div className='ml-auto hidden items-center gap-1 pr-2 group-hover:flex'>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='inline-flex'>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6 opacity-70 hover:opacity-100'
                onClick={e => {
                  e.stopPropagation()
                  onSave(id, name)
                }}
              >
                <Save className='h-3.5 w-3.5' />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save file</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className='inline-flex'>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6 opacity-70 hover:opacity-100'
                onClick={e => {
                  e.stopPropagation()
                  startRename()
                }}
              >
                <Edit className='h-3.5 w-3.5' />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rename file</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className='inline-flex'>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6 text-destructive opacity-70 hover:text-destructive hover:opacity-100'
                onClick={e => {
                  e.stopPropagation()
                  onDelete(id, name)
                }}
              >
                <Trash className='h-3.5 w-3.5' />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete file</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
