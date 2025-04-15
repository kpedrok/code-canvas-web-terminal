import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { useProjectsStore } from '@/lib/projects-store'
import { toast } from '@/hooks/use-toast'

interface NewProjectDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function NewProjectDialog({ open: controlledOpen, onOpenChange }: NewProjectDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const createProject = useProjectsStore(state => state.createProject)
  const navigate = useNavigate()

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setName('')
      setDescription('')
    }
  }, [open])

  const handleCreateProject = async () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Project name is required',
        variant: 'destructive',
      })
      return
    }

    setIsCreating(true)

    try {
      createProject(name, description)
      toast({
        title: 'Success',
        description: 'Project created successfully',
      })
      handleOpenChange(false)
      navigate('/dashboard')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className='neon-border flex items-center transition-shadow duration-300 hover:shadow-primary/30'>
          <Plus className='mr-1 h-4 w-4' />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>Enter project details to create a new coding project.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input
              id='name'
              placeholder='My Python Project'
              className='col-span-3'
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='description' className='text-right'>
              Description
            </Label>
            <Input
              id='description'
              placeholder='A short description of your project'
              className='col-span-3'
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateProject} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
