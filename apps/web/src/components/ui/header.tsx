import { Menu, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from './breadcrumb';

type Props = {
  onToggleSidebar: () => void;
};

export function Header({ onToggleSidebar }: Props) {
  return (
    <header className="w-full h-14 border-b flex items-center px-4 bg-background">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="hover:cursor-pointer"
      >
        <Menu size={20} />
      </Button>
      <div className="ml-6">
        <Breadcrumb />
      </div>
      <div className="ml-auto rounded-4xl">
        <UserRound className="w-6 h-6 hover:cursor-pointer hover:bg-gray-200 hover:rounded-full ml-2" />
      </div>
    </header>
  );
}
