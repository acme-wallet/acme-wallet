import type { FormEvent } from 'react';
import {
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInput as ShadcnPromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from '@/components/ai/prompt-input';
import { PlusIcon } from 'lucide-react';
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
  placeholder = 'Pergunte alguma coisa...',
  className,
}: PromptInputProps) {
  function handleSubmit(
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (disabled || !message.text.trim()) return;
    onSubmit();
  }

  return (
    <ShadcnPromptInput
      onSubmit={handleSubmit}
      className={cn(
        'rounded-2xl border border-border bg-background shadow-sm',
        className,
      )}
      multiple
      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
    >
      <PromptInputAttachments>
        {(attachment) => <PromptInputAttachment data={attachment} />}
      </PromptInputAttachments>
      <PromptInputBody>
        <PromptInputTextarea
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="min-h-12 max-h-[200px] border-0 bg-transparent text-sm leading-relaxed shadow-none focus-visible:ring-0"
        />
      </PromptInputBody>
      <PromptInputFooter className="px-2 pb-2">
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger
              type="button"
              disabled={disabled}
              aria-label="Abrir menu de anexo"
              className="h-8 w-8 rounded-xl"
            >
              <PlusIcon className="h-4 w-4" />
            </PromptInputActionMenuTrigger>
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments label="Adicionar fotos ou arquivos" />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit
          disabled={disabled || !value.trim()}
          className={cn(
            'h-8 w-8 rounded-xl',
            disabled || !value.trim()
              ? 'text-muted-foreground/40'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )}
        />
      </PromptInputFooter>
    </ShadcnPromptInput>
  );
}
