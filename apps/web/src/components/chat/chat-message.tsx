import { cn } from '@/lib/utils';
import { ReasoningBlock } from './reasoning-block';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  isStreaming?: boolean;
}

interface ChatMessageProps {
  message: Message;
  className?: string;
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row',
        className,
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-xs font-semibold',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground border border-border',
        )}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'flex max-w-[80%] flex-col gap-1',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        {/* Reasoning block (only for assistant) */}
        {!isUser && message.reasoning && (
          <ReasoningBlock
            content={message.reasoning}
            isStreaming={message.isStreaming && !message.content}
            className="w-full max-w-prose"
          />
        )}

        {/* Text content */}
        {(message.content || isUser) && (
          <div
            className={cn(
              'rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-prose',
              isUser
                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                : 'bg-muted text-foreground rounded-tl-sm',
            )}
          >
            {message.content || (
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
              </span>
            )}
            {message.isStreaming && message.content && (
              <span className="inline-block h-4 w-0.5 animate-pulse bg-current align-text-bottom ml-0.5" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
