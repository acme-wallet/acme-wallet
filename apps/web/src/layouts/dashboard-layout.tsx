import { useEffect, useRef, useState } from 'react';
import { Header } from '@/components/ui/header';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Sidebar } from '@/components/ui/sidebar';
import { SidebarChat } from '@/components/ui/sidebar-chat';
import type { PanelImperativeHandle } from 'react-resizable-panels';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const chatPanelRef = useRef<PanelImperativeHandle | null>(null);

  useEffect(() => {
    if (openChat) {
      chatPanelRef.current?.expand();
      return;
    }

    chatPanelRef.current?.collapse();
  }, [openChat]);

  return (
    <div className="w-screen h-screen flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setOpen(!open)}
          onOpenChat={() => setOpenChat(!openChat)}
        />

        <div className="flex-1 min-h-0">
          <div className="lg:hidden">
            <SidebarChat open={openChat} onClose={() => setOpenChat(false)} />
          </div>

          <main className="h-full p-6 rounded-md w-full overflow-auto min-w-0 lg:hidden">
            {children}
          </main>

          <ResizablePanelGroup
            orientation="horizontal"
            className="hidden lg:flex h-full w-full"
          >
            <ResizablePanel id="dashboard-content" minSize="480px">
              <main className="h-full p-6 rounded-md w-full overflow-auto min-w-0">
                {children}
              </main>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className={!openChat ? 'pointer-events-none opacity-0' : ''}
            />
            <ResizablePanel
              id="dashboard-chat"
              panelRef={chatPanelRef}
              collapsible
              collapsedSize="0px"
              defaultSize="420px"
              minSize="400px"
              maxSize="720px"
            >
              <SidebarChat
                desktop
                open={openChat}
                onClose={() => setOpenChat(false)}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
