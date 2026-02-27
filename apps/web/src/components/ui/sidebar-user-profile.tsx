type SidebarUserProfileProps = {
  open: boolean;
  initials: string;
  fullName: string;
  role: string;
  onClick?: () => void;
};

export function SidebarUserProfile({
  open,
  initials,
  fullName,
  role,
  onClick,
}: SidebarUserProfileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex w-full items-center rounded-md border bg-background text-left transition-colors hover:bg-muted
        ${open ? 'gap-3 p-2' : 'justify-center p-2'}
      `}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
        {initials}
      </div>

      {open && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{role}</p>
        </div>
      )}
    </button>
  );
}
