import { TooltipProvider } from '@/components/ui/tooltip'
import { FileItem } from './FileItem'
import { NewFileForm } from './NewFileForm'

interface FileData {
  id: string
  name: string
  content: string
  language: string
}

interface FileListProps {
  files: FileData[]
  activeFileId: string | null
  isCreatingFile: boolean
  onFileClick: (id: string) => void
  onSaveFile: (id: string, name: string) => void
  onRenameFile: (id: string, name: string) => void
  onDeleteFile: (id: string, name: string) => void
  onNewFileSubmit: (fileName: string) => void
  onCancelNewFile: () => void
}

export function FileList({
  files,
  activeFileId,
  isCreatingFile,
  onFileClick,
  onSaveFile,
  onRenameFile,
  onDeleteFile,
  onNewFileSubmit,
  onCancelNewFile,
}: FileListProps) {
  return (
    <div className='space-y-1'>
      <TooltipProvider delayDuration={300}>
        {files.map(file => (
          <div key={file.id} className='group relative'>
            <FileItem
              id={file.id}
              name={file.name}
              isActive={activeFileId === file.id}
              onFileClick={onFileClick}
              onSave={onSaveFile}
              onRename={onRenameFile}
              onDelete={onDeleteFile}
            />
          </div>
        ))}
      </TooltipProvider>

      {isCreatingFile && <NewFileForm onSubmit={onNewFileSubmit} onCancel={onCancelNewFile} />}
    </div>
  )
}
