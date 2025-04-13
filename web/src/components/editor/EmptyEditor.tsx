
import { Code } from "lucide-react";

export function EmptyEditor() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <Code className="h-10 w-10 mb-3 text-primary opacity-50" />
      <p className="text-lg">No file selected</p>
      <p className="text-sm opacity-70 mt-1">Select a file from the sidebar to start editing</p>
    </div>
  );
}
