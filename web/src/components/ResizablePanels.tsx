
import { ReactNode } from 'react';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '@/components/ui/resizable';

interface ResizablePanelsProps {
  top?: ReactNode;
  left?: ReactNode;
  main: ReactNode;
  bottom?: ReactNode;
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
}

export function ResizablePanels({
  top,
  left,
  main,
  bottom,
  defaultLayout = [20, 80],
  defaultCollapsed = false,
}: ResizablePanelsProps) {
  return (
    <ResizablePanelGroup 
      direction="vertical" 
      className="h-full w-full"
    >
      {/* Main Content Area */}
      <ResizablePanel defaultSize={top ? defaultLayout[0] : 100}>
        <ResizablePanelGroup direction="horizontal">
          {/* Left Sidebar */}
          {left && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                {left}
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}
          
          {/* Main Content */}
          <ResizablePanel defaultSize={left ? 80 : 100}>
            {top ? top : main}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      
      {/* Bottom Panel (Terminal) */}
      {bottom && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={10}>
            {bottom}
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
