import { Editor } from '@monaco-editor/react'
import { useRef } from 'react'

interface MonacoEditorWrapperProps {
  content: string
  language: string
  onChange: (value: string | undefined) => void
}

export function MonacoEditorWrapper({ content, language, onChange }: MonacoEditorWrapperProps) {
  const editorRef = useRef<any>(null)

  // Handle editor mounting
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    // Focus the editor
    editor.focus()
  }

  // Define editor options
  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
    lineNumbers: 'on' as const,
    roundedSelection: false,
    automaticLayout: true,
    tabSize: 4,
    insertSpaces: true,
    wordWrap: 'on' as const,
    padding: { top: 16, bottom: 16 },
    glyphMargin: true,
    smoothScrolling: true,
    cursorBlinking: 'smooth' as const,
    cursorSmoothCaretAnimation: 'on' as const,
    mouseWheelZoom: true,
  }

  return (
    <div className='flex-1 animate-fade-in'>
      <Editor
        height='100%'
        defaultLanguage={language}
        defaultValue={content}
        value={content}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme='vs-dark'
        options={editorOptions}
        className='h-full w-full'
      />
    </div>
  )
}
