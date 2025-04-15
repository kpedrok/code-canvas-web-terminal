import { Code } from 'lucide-react'

export function EmptyEditor() {
  return (
    <div className='flex h-full flex-col items-center justify-center text-muted-foreground'>
      <Code className='mb-3 h-10 w-10 text-primary opacity-50' />
      <p className='text-lg'>No file selected</p>
      <p className='mt-1 text-sm opacity-70'>Select a file from the sidebar to start editing</p>
    </div>
  )
}
