import { Menu, Sparkles } from 'lucide-react';
import { HeaderIconButton } from './header-icon-button';

type Props = {
  onToggleSidebar: () => void;
  onOpenChat?: () => void;
};

export function Header({ onOpenChat, onToggleSidebar }: Props) {
  return (
    <header className="w-full h-14 border-b flex items-center px-4 bg-background">
      <HeaderIconButton icon={Menu} label="Menu" onClick={onToggleSidebar} />
      <div className="ml-auto rounded-4xl flex items-center gap-1">
        <HeaderIconButton icon={Sparkles} label="IA" onClick={onOpenChat} />
      </div>
    </header>
  );
}
