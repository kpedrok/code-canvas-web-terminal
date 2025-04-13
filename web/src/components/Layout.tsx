import { Header } from './Header'
import { CodeEditor } from './CodeEditor'
import { Terminal } from './Terminal'
import { FileSidebar } from './FileSidebar'
import { ResizablePanels } from './ResizablePanels'

interface LayoutProps {
  projectId?: string
}

export function Layout({ projectId }: LayoutProps = {}) {
  return (
    <div className='flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-background/90'>
      <ResizablePanels
        left={<FileSidebar />}
        main={<CodeEditor />}
        bottom={<Terminal projectId={projectId} />}
        defaultLayout={[65, 35]}
      />
    </div>
  )
}
