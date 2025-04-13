
/**
 * Hook to determine the editor language based on file extension
 */
export function useEditorLanguage() {
  const getLanguageFromFileName = (fileName: string): string => {
    if (!fileName) return 'plaintext';
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch(ext) {
      case 'py': return 'python';
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'jsx': return 'javascriptreact';
      case 'tsx': return 'typescriptreact';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  return { getLanguageFromFileName };
}
