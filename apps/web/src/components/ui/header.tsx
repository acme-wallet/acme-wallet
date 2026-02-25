import { Menu, Stars, UserRound } from 'lucide-react';
import { HeaderIconButton } from './header-icon-button';

type Props = {
  onToggleSidebar: () => void;
  onClickStars?: () => void;
  onClickUser?: () => void;
};

export function Header({ onClickStars, onClickUser, onToggleSidebar }: Props) {
  return (
    <header className="w-full h-14 border-b flex items-center px-4 bg-background">
      <HeaderIconButton icon={Menu} label="Menu" onClick={onToggleSidebar} />
      <div className="ml-auto rounded-4xl flex items-center gap-1">
        <HeaderIconButton
          icon={Stars}
          label="Favoritos"
          onClick={onClickStars}
        />
        <HeaderIconButton
          icon={UserRound}
          label="Perfil"
          onClick={onClickUser}
        />
      </div>
    </header>
  );
}
