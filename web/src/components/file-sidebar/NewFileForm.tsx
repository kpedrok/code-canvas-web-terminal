import { File } from 'lucide-react'
import { useState } from 'react'

interface NewFileFormProps {
  onSubmit: (fileName: string) => void
  onCancel: () => void
}

export function NewFileForm({ onSubmit, onCancel }: NewFileFormProps) {
  const [fileName, setFileName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (fileName.trim()) {
      onSubmit(fileName)
      setFileName('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex items-center px-2 py-1'>
      <File className='mr-2 h-4 w-4 text-sidebar-foreground/70' />
      <input
        type='text'
        value={fileName}
        onChange={e => setFileName(e.target.value)}
        placeholder='filename.py'
        className='flex-1 rounded bg-sidebar-accent px-1 text-sm outline-none'
        autoFocus
        onBlur={onCancel}
        onKeyDown={e => e.key === 'Escape' && onCancel()}
      />
    </form>
  )
}
