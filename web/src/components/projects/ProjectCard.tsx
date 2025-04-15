import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Code2, FolderOpenIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Project } from '@/lib/projects-store'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className='overflow-hidden rounded-lg border border-border bg-card'>
      <div className='flex h-full flex-col p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center space-x-2'>
            <Code2 className='h-5 w-5 text-primary' />
            <h3 className='text-lg font-semibold'>{project.name}</h3>
          </div>
        </div>

        <p className='mt-2 line-clamp-2 flex-grow text-sm text-muted-foreground'>
          {project.description || 'No description provided'}
        </p>

        <div className='mt-4 text-xs text-muted-foreground'>
          Updated {formatDistanceToNow(new Date(project.updatedAt))} ago
        </div>

        <div className='mt-4 flex justify-end'>
          <Button asChild size='sm' variant='default'>
            <Link to={`/project/${project.id}`} className='flex items-center'>
              <FolderOpenIcon className='mr-1 h-4 w-4' />
              Open Project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
