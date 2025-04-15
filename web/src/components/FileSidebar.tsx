import { useState } from 'react'
import { useFileStore } from '@/lib/file-store'
import { useToast } from '@/hooks/use-toast'
import { FileSidebarHeader } from './file-sidebar/FileSidebarHeader'
import { FileList } from './file-sidebar/FileList'

interface FileSidebarProps {
  projectId?: string
}

export function FileSidebar({ projectId }: FileSidebarProps) {
  const { files, activeFileId, setActiveFile, addFile, deleteFile, renameFile, saveFile } = useFileStore()
  const [newFileName, setNewFileName] = useState('')
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const { toast } = useToast()

  const handleFileClick = (id: string) => {
    setActiveFile(id)
  }

  const handleCreateFile = () => {
    setIsCreatingFile(true)
  }

  const handleNewFileSubmit = (fileName: string) => {
    if (!projectId) {
      toast({
        title: 'Cannot create file',
        description: 'No project is currently active.',
        variant: 'destructive',
      })
      return
    }

    // Add .py extension if none provided
    const formattedFileName = fileName.includes('.') ? fileName : `${fileName}.py`

    addFile(
      {
        name: formattedFileName,
        language: 'python',
        content: '# New file\n',
      },
      projectId
    )

    setNewFileName('')
    setIsCreatingFile(false)

    toast({
      title: 'File created',
      description: `${formattedFileName} has been created.`,
    })
  }

  const cancelNewFile = () => {
    setNewFileName('')
    setIsCreatingFile(false)
  }

  const handleDeleteFile = (id: string, name: string) => {
    if (files.length <= 1) {
      toast({
        title: 'Cannot delete file',
        description: 'You must have at least one file in the project.',
        variant: 'destructive',
      })
      return
    }

    deleteFile(id)
    toast({
      title: 'File deleted',
      description: `${name} has been deleted.`,
    })
  }

  const handleRenameFile = (id: string, newName: string) => {
    renameFile(id, newName)
  }

  const handleSaveFile = (id: string, name: string) => {
    saveFile(id)
    toast({
      title: 'File saved',
      description: `${name} has been saved.`,
    })
  }

  return (
    <div className='flex h-full w-full flex-col border-r border-border bg-sidebar text-sidebar-foreground'>
      <FileSidebarHeader onCreateFile={handleCreateFile} />

      <div className='p-2'>
        <FileList
          files={files}
          activeFileId={activeFileId}
          isCreatingFile={isCreatingFile}
          onFileClick={handleFileClick}
          onSaveFile={handleSaveFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
          onNewFileSubmit={handleNewFileSubmit}
          onCancelNewFile={cancelNewFile}
        />
      </div>
    </div>
  )
}
