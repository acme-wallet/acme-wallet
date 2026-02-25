import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderIconButtonProps = {
  icon: LucideIcon;
  onClick?: () => void;
  label: string;
  className?: string;
};

export function HeaderIconButton({
  icon: Icon,
  onClick,
  label,
}: HeaderIconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <Icon className="w-6 h-6" />
    </Button>
  );
}
