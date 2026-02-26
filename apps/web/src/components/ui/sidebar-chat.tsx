import { useEffect, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatContainer } from '../chat/chat-container';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SidebarChat({ open, onClose }: Props) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-screen w-full max-w-[420px] bg-card border-l transition-transform duration-300',
          'lg:relative lg:top-auto lg:right-auto lg:z-auto lg:h-full lg:translate-x-0 lg:transition-[width] lg:duration-300 lg:max-w-none lg:overflow-hidden',
          open ? 'translate-x-0 lg:w-[420px]' : 'translate-x-full lg:w-0',
        )}
      >
        <div className="h-full flex flex-col bg-background">
          <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles size={16} />
              </div>

              <div>
                <p className="text-sm font-semibold leading-none">HarpIA</p>
                <p className="text-xs text-muted-foreground">AI Assistant</p>
              </div>
            </div>

            <button
              type="button"
              className="hover:cursor-pointer rounded p-1 text-muted-foreground hover:text-foreground lg:hidden"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <ChatContainer />
          </div>
        </div>
      </aside>
    </>
  );
}
