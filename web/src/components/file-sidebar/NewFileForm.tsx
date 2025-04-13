
import { File } from 'lucide-react';
import { useState } from 'react';

interface NewFileFormProps {
  onSubmit: (fileName: string) => void;
  onCancel: () => void;
}

export function NewFileForm({ onSubmit, onCancel }: NewFileFormProps) {
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (fileName.trim()) {
      onSubmit(fileName);
      setFileName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center px-2 py-1">
      <File className="h-4 w-4 mr-2 text-sidebar-foreground/70" />
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="filename.py"
        className="bg-sidebar-accent text-sm outline-none rounded px-1 flex-1"
        autoFocus
        onBlur={onCancel}
        onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      />
    </form>
  );
}
