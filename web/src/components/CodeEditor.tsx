
import { useFileStore } from '@/lib/file-store';
import { EditorHeader } from './editor/EditorHeader';
import { EmptyEditor } from './editor/EmptyEditor';
import { MonacoEditorWrapper } from './editor/MonacoEditorWrapper';
import { useEditorLanguage } from './editor/useEditorLanguage';

export function CodeEditor() {
  const { files, activeFileId, updateFileContent } = useFileStore();
  const activeFile = files.find(file => file.id === activeFileId);
  const { getLanguageFromFileName } = useEditorLanguage();
  
  // Handle content changes
  const handleEditorChange = (value: string | undefined) => {
    if (activeFileId && value !== undefined) {
      updateFileContent(activeFileId, value);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-editor text-editor-foreground overflow-hidden">
      {activeFile ? (
        <div className="flex flex-col w-full h-full">
          <EditorHeader activeFile={activeFile} />
          <MonacoEditorWrapper 
            content={activeFile.content} 
            language={getLanguageFromFileName(activeFile.name)}
            onChange={handleEditorChange}
          />
        </div>
      ) : (
        <EmptyEditor />
      )}
    </div>
  );
}
