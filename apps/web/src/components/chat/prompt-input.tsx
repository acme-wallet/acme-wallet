import { useRef, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = 'Envie uma mensagem...',
  className,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!disabled && value.trim()) onSubmit();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  return (
    <div
      className={cn(
        'flex items-end gap-2 rounded-2xl border border-border bg-background px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition-shadow',
        className,
      )}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-50"
        style={{ maxHeight: '200px' }}
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        title="Enviar (Ctrl+Enter)"
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all',
          disabled || !value.trim()
            ? 'text-muted-foreground/40 cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm',
        )}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
}
