import { useState } from 'react';
import { cn } from '@/lib/utils';

const MODELS = [
  { value: 'o4-mini', label: 'o4-mini (Reasoning)' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
] as const;

export type ModelOption = (typeof MODELS)[number]['value'];

interface SystemPromptConfigProps {
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  model: ModelOption;
  onModelChange: (value: ModelOption) => void;
  className?: string;
}

export function SystemPromptConfig({
  systemPrompt,
  onSystemPromptChange,
  model,
  onModelChange,
  className,
}: SystemPromptConfigProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn('rounded-xl border border-border bg-muted/30', className)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-xl transition-colors"
      >
        <span className="flex items-center gap-2 text-muted-foreground">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
          </svg>
          Configurações
        </span>
        <svg
          viewBox="0 0 24 24"
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="border-t border-border px-4 py-4 space-y-4">
          {/* Model selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Modelo
            </label>
            <select
              value={model}
              onChange={(e) => onModelChange(e.target.value as ModelOption)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* System prompt */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              System Prompt
            </label>
            <textarea
              rows={4}
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              placeholder="Ex: Você é um assistente especializado em finanças..."
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">
              Aplica-se às próximas mensagens enviadas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
