import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Bot, SendHorizontal, Sparkles, UserRound, X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-assistant',
    role: 'assistant',
    content:
      'Hi! I am your assistant. Ask me anything about your wallet, transactions, or settings.',
  },
];

function buildAssistantReply(prompt: string) {
  if (prompt.length < 25) {
    return `Good question. "${prompt}" is a good starting point. If you want, I can break this down step by step.`;
  }

  return `I understood your request: "${prompt}". Here is a practical approach:\n1. Define the goal clearly.\n2. Execute in small verifiable steps.\n3. Validate the result before moving on.\n\nIf you share more context, I can make this answer specific to your case.`;
}

export function SidebarChat({ open, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [prompt, setPrompt] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnswering, open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isAnswering) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedPrompt,
    };

    setMessages((previous) => [...previous, userMessage]);
    setPrompt('');
    setIsAnswering(true);

    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: buildAssistantReply(trimmedPrompt),
      };

      setMessages((previous) => [...previous, assistantMessage]);
      setIsAnswering(false);
    }, 700);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
                    fixed top-0 right-0 z-50 h-screen w-full max-w-[420px] bg-card border-l transition-transform duration-300
                    ${open ? 'translate-x-0' : 'translate-x-full'}
                    lg:relative lg:top-auto lg:right-auto lg:z-auto lg:h-full lg:translate-x-0 lg:transition-[width] lg:duration-300
                    ${open ? 'lg:w-[420px]' : 'lg:w-0'}
                    lg:max-w-none lg:overflow-hidden
                `}
      >
        <div className="h-full flex flex-col bg-background">
          <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles size={16} />
              </div>

              <div>
                <p className="text-sm font-semibold leading-none">ChatGPT</p>
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
            {messages.map((message) => (
              <article
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot size={14} />
                  </div>
                )}

                <div
                  className={`
                    max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line
                    ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }
                  `}
                >
                  {message.content}
                </div>

                {message.role === 'user' && (
                  <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <UserRound size={14} />
                  </div>
                )}
              </article>
            ))}

            {isAnswering && (
              <div className="flex items-center gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot size={14} />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <footer className="border-t p-3">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Message ChatGPT..."
                className="min-h-[44px] max-h-28 flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
              />

              <button
                type="submit"
                disabled={isAnswering || prompt.trim().length === 0}
                className="inline-flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendHorizontal size={16} />
              </button>
            </form>
          </footer>
        </div>
      </aside>
    </>
  );
}
