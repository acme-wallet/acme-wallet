import { cn } from '@/lib/utils';
import { CornerDownRight } from 'lucide-react';


interface ChatSuggestionsProps {
  suggestions: readonly string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
  horizontal?: boolean;
  className?: string;
}

export function ChatSuggestions({
  suggestions,
  onSelect,
  disabled,
  horizontal,
  className,
}: ChatSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div
      className={cn(
        'flex gap-2',
        horizontal ? 'overflow-x-auto whitespace-nowrap pb-1' : 'flex-wrap',
        className,
      )}
    >
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] text-muted-foreground transition-colors',
            'hover:bg-muted/60 hover:text-foreground hover:cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <CornerDownRight  className="h-3.5 w-3.5 shrink-0" />
          {suggestion}
        </button>
      ))}
    </div>
  );
}
