import { cn } from '@/lib/utils';

interface ReasoningBlockProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export function ReasoningBlock({
  content,
  isStreaming,
  className,
}: ReasoningBlockProps) {
  return (
    <details
      open={isStreaming}
      className={cn(
        'group my-2 rounded-lg border border-border bg-muted/40 text-sm',
        className,
      )}
    >
      <summary className="flex cursor-pointer select-none items-center gap-2 px-3 py-2 font-medium text-muted-foreground hover:text-foreground">
        <svg
          className="h-3.5 w-3.5 transition-transform group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9 18 6-6-6-6"
          />
        </svg>
        <span>
          {isStreaming ? (
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              Pensando...
            </span>
          ) : (
            'Raciocínio'
          )}
        </span>
      </summary>
      <div className="border-t border-border px-3 py-2 text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono text-xs">
        {content}
        {isStreaming && (
          <span className="inline-block h-3.5 w-0.5 animate-pulse bg-amber-400 align-text-bottom ml-0.5" />
        )}
      </div>
    </details>
  );
}
