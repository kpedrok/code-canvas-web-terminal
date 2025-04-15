import { CodeFile } from '@/lib/file-store'

interface EditorHeaderProps {
  activeFile: CodeFile
}

export function EditorHeader({ activeFile }: EditorHeaderProps) {
  const getLanguage = () => {
    if (!activeFile) return 'plaintext'

    const ext = activeFile.name.split('.').pop()?.toLowerCase()

    switch (ext) {
      case 'py':
        return 'python'
      case 'js':
        return 'javascript'
      case 'ts':
        return 'typescript'
      case 'jsx':
        return 'javascriptreact'
      case 'tsx':
        return 'typescriptreact'
      case 'html':
        return 'html'
      case 'css':
        return 'css'
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      default:
        return 'plaintext'
    }
  }

  return (
    <div className='glass flex items-center border-b border-border/50 bg-editor/80 px-4 py-2 text-sm'>
      <span className='font-medium'>{activeFile.name}</span>
      <span className='ml-auto rounded bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground'>
        {getLanguage().toUpperCase()}
      </span>
    </div>
  )
}
