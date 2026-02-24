import { sidebarRoutes } from '@/utils/sidebar-routes';
import { Link } from '@tanstack/react-router';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
                    fixed top-0 left-0 z-50 h-screen bg-card border-r transition-all duration-300
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                    lg:static lg:translate-x-0
                    ${open ? 'lg:w-64' : 'lg:w-16'}
                    w-64
                `}
      >
        <div className="flex items-center justify-between p-4 lg:justify-center">
          <img src="/login-image.jpg" alt="Logo" className="w-12 h-12" />

          <button className="lg:hidden hover:cursor-pointer" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="p-2 space-y-2">
          {sidebarRoutes.map((route) => {
            const Icon = route.icon;

            return (
              <Link
                key={route.path}
                to={route.path}
                className={`
                                    flex items-center rounded transition-colors hover:bg-muted
                                    ${open ? 'gap-2 px-3 py-2' : 'justify-center py-3'}
                                `}
              >
                <Icon size={18} />

                <span
                  className={`
                                        whitespace-nowrap transition-all duration-200
                                        ${open ? 'opacity-100 ml-2' : 'opacity-0 w-0 overflow-hidden'}
                                    `}
                >
                  {route.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
