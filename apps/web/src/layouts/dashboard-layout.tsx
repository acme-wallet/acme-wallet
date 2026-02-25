import { useState } from 'react';
import { Header } from '@/components/ui/header';
import { Sidebar } from '@/components/ui/sidebar';
import { SidebarChat } from '@/components/ui/sidebar-chat';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [openChat, setOpenChat] = useState(false);

  return (
    <div className="w-screen h-screen flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setOpen(!open)}
          onClickStars={() => setOpenChat(!openChat)}
        />

        <div className="flex-1 flex min-h-0">
          <main className="flex-1 p-6 rounded-md w-full overflow-auto min-w-0">
            {children}
          </main>

          <SidebarChat open={openChat} onClose={() => setOpenChat(false)} />
        </div>
      </div>
    </div>
  );
}
