import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChatContainer } from '../chat/chat-container';

type Props = {
  open: boolean;
  onClose: () => void;
  desktop?: boolean;
};

export function SidebarChat({ open, onClose, desktop = false }: Props) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [open]);

  return (
    <>
      {!desktop && open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'bg-card border-l',
          desktop
            ? 'relative z-auto h-full w-full max-w-none overflow-hidden'
            : 'fixed top-0 right-0 z-50 h-screen w-full max-w-[420px] transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="h-full flex flex-col bg-background">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <ChatContainer />
          </div>
        </div>
      </aside>
    </>
  );
}
