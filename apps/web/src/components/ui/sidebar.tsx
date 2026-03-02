import { useEffect, useState } from 'react';
import {
  getModuleFromPathname,
  getSidebarRoutes,
  type SidebarRoute,
  type SystemModule,
} from '@/utils/sidebar-routes';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  Brain,
  ChevronDown,
  ChevronsUpDown,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from './button';
import { SidebarUserProfile } from './sidebar-user-profile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

type Props = {
  open: boolean;
  onClose: () => void;
};

type SidebarOption = {
  module: SystemModule;
  label: string;
  icon: LucideIcon;
};

const SIDEBAR_MODULE_STORAGE_KEY = 'acme_selected_module';

const availableOptions: SidebarOption[] = [
  { module: 'factory', label: 'Factory One', icon: Brain },
  { module: 'human', label: 'Human Evolution', icon: Workflow },
];

export function Sidebar({ open, onClose }: Props) {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const moduleFromPathname = getModuleFromPathname(pathname);
  const [selectedModule, setSelectedModule] = useState<SystemModule>(() => {
    if (typeof window === 'undefined') return 'factory';
    const stored = window.localStorage.getItem(SIDEBAR_MODULE_STORAGE_KEY);
    return stored === 'human' || stored === 'factory' ? stored : 'factory';
  });
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );
  const selectedOption =
    availableOptions.find((option) => option.module === selectedModule) ??
    availableOptions[0];
  const SelectedOptionIcon = selectedOption.icon;
  const sidebarRoutes: SidebarRoute[] = getSidebarRoutes(selectedModule);

  useEffect(() => {
    if (!moduleFromPathname || moduleFromPathname === selectedModule) return;

    setSelectedModule(moduleFromPathname);
    window.localStorage.setItem(SIDEBAR_MODULE_STORAGE_KEY, moduleFromPathname);
  }, [moduleFromPathname, selectedModule]);

  function toggleMenu(path: string) {
    setExpandedMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  }

  function handleSelectModule(option: SidebarOption) {
    setSelectedModule(option.module);
    window.localStorage.setItem(SIDEBAR_MODULE_STORAGE_KEY, option.module);

    if (option.module === 'factory') {
      navigate({ to: '/factory/home' });
      return;
    }

    navigate({ to: '/human/home' });
  }

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
            fixed top-0 left-0 z-50 h-screen bg-card border-r transition-all duration-300 flex flex-col
            ${open ? 'translate-x-0' : '-translate-x-full'}
            lg:static lg:translate-x-0
            ${open ? 'w-64 lg:w-64' : 'w-16 lg:w-16'}
        `}
      >
        <div className="flex justify-end w-full p-2">
          <Button
            variant="ghost"
            className="lg:hidden hover:cursor-pointer"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>
        <div className="flex items-center justify-between p-2 lg:justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`gap-2 ${open ? 'w-full justify-start' : 'w-10 justify-center p-0'}`}
              >
                <SelectedOptionIcon className="h-5 w-5" />
                {open && (
                  <>
                    <span className="truncate text-sm font-semibold">
                      {selectedOption.label}
                    </span>
                    <ChevronsUpDown className="ml-auto" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" side="right">
              {availableOptions.map((option) => (
                <DropdownMenuItem
                  key={option.label}
                  onSelect={() => handleSelectModule(option)}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-2">
          {sidebarRoutes.map((route: SidebarRoute) => {
            const Icon = route.icon;
            const hasChildren = Boolean(route.children?.length);
            const isActiveByPath = Boolean(
              route.children?.some((child) => pathname.startsWith(child.path)),
            );
            const hasManualState = route.path in expandedMenus;
            const isExpanded = hasManualState
              ? expandedMenus[route.path]
              : isActiveByPath;

            if (hasChildren) {
              return (
                <div key={route.path}>
                  <button
                    type="button"
                    onClick={() => toggleMenu(route.path)}
                    className={`
                      flex w-full items-center rounded transition-colors hover:bg-muted
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

                    {open && (
                      <ChevronDown
                        className={`ml-auto h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>

                  {open && isExpanded && (
                    <div className="mt-1 ml-7 space-y-1">
                      {route.children?.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="flex items-center gap-2 rounded px-2 py-2 text-sm transition-colors hover:bg-muted"
                        >
                          <child.icon size={14} />
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

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

        <div className="border-t p-2">
          <SidebarUserProfile
            open={open}
            initials="JS"
            fullName="Joao Silva"
            role="Coordenador PCP"
          />
        </div>
      </aside>
    </>
  );
}
