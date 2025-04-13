
import { Header } from './Header';
import { CodeEditor } from './CodeEditor';
import { Terminal } from './Terminal';
import { FileSidebar } from './FileSidebar';
import { ResizablePanels } from './ResizablePanels';

export function Layout() {
  return (
    <div className="flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-background/90">
      <ResizablePanels
        left={<FileSidebar />}
        main={<CodeEditor />}
        bottom={<Terminal />}
        defaultLayout={[65, 35]}
      />
    </div>
  );
}
