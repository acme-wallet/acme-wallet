import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { PaperclipIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Attachment = {
  id: string;
  file: File;
};

type PromptInputContextValue = {
  attachments: Attachment[];
  removeAttachment: (id: string) => void;
  openFileDialog: () => void;
};

const PromptInputContext = createContext<PromptInputContextValue | null>(null);

function usePromptInputContext() {
  const context = useContext(PromptInputContext);
  if (!context) {
    throw new Error(
      'PromptInput components must be used inside <PromptInput>.',
    );
  }
  return context;
}

export interface PromptInputMessage {
  text: string;
  files: File[];
}

export type PromptInputProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>,
  ) => void | Promise<void>;
  accept?: string;
  multiple?: boolean;
};

export function PromptInput({
  className,
  children,
  onSubmit,
  accept,
  multiple,
  ...props
}: PromptInputProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleOpenFileDialog() {
    fileInputRef.current?.click();
  }

  function handleRemoveAttachment(id: string) {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setAttachments((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        file,
      })),
    ]);

    // Allow selecting the same file again.
    event.target.value = '';
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const text = String(formData.get('message') ?? '');
    void onSubmit(
      {
        text,
        files: attachments.map((item) => item.file),
      },
      event,
    );
  }

  return (
    <PromptInputContext.Provider
      value={{
        attachments,
        removeAttachment: handleRemoveAttachment,
        openFileDialog: handleOpenFileDialog,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
      />
      <form
        className={cn('w-full', className)}
        onSubmit={handleSubmit}
        {...props}
      >
        <InputGroup className="overflow-hidden rounded-2xl">{children}</InputGroup>
      </form>
    </PromptInputContext.Provider>
  );
}

export function PromptInputAttachments({
  children,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: (attachment: { id: string; filename: string }) => ReactNode;
}) {
  const { attachments } = usePromptInputContext();
  if (!attachments.length) return null;

  return (
    <div
      className={cn('flex w-full flex-wrap items-center gap-2 p-3', className)}
      {...props}
    >
      {attachments.map((attachment) =>
        children({ id: attachment.id, filename: attachment.file.name }),
      )}
    </div>
  );
}

export function PromptInputAttachment({
  data,
}: {
  data: { id: string; filename: string };
}) {
  const { removeAttachment } = usePromptInputContext();

  return (
    <div className="bg-muted/60 text-foreground flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
      <PaperclipIcon className="h-3.5 w-3.5" />
      <span className="max-w-[220px] truncate">{data.filename}</span>
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={() => removeAttachment(data.id)}
        aria-label={`Remover ${data.filename}`}
      >
        <XIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export const PromptInputBody = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('contents', className)} {...props} />
);

export const PromptInputTextarea = (
  props: ComponentProps<typeof InputGroupTextarea>,
) => <InputGroupTextarea name="message" {...props} />;

export const PromptInputFooter = ({
  className,
  ...props
}: Omit<ComponentProps<typeof InputGroupAddon>, 'align'>) => (
  <InputGroupAddon
    align="block-end"
    className={cn('justify-between gap-1', className)}
    {...props}
  />
);

export const PromptInputTools = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center gap-1', className)} {...props} />
);

export const PromptInputSubmit = (
  props: ComponentProps<typeof InputGroupButton>,
) => <InputGroupButton type="submit" size="icon-sm" {...props} />;

export const PromptInputActionMenu = (
  props: ComponentProps<typeof DropdownMenu>,
) => <DropdownMenu {...props} />;

export const PromptInputActionMenuTrigger = ({
  children,
  ...props
}: ComponentProps<typeof InputGroupButton>) => (
  <DropdownMenuTrigger asChild>
    <InputGroupButton type="button" size="icon-sm" {...props}>
      {children}
    </InputGroupButton>
  </DropdownMenuTrigger>
);

export const PromptInputActionMenuContent = (
  props: ComponentProps<typeof DropdownMenuContent>,
) => <DropdownMenuContent align="start" {...props} />;

export const PromptInputActionMenuItem = (
  props: ComponentProps<typeof DropdownMenuItem>,
) => <DropdownMenuItem {...props} />;

export function PromptInputActionAddAttachments({
  label = 'Adicionar fotos ou arquivos',
}: {
  label?: string;
}) {
  const { openFileDialog } = usePromptInputContext();
  const id = useId();

  return (
    <PromptInputActionMenuItem
      key={id}
      onSelect={(event) => {
        event.preventDefault();
        openFileDialog();
      }}
    >
      {label}
    </PromptInputActionMenuItem>
  );
}
