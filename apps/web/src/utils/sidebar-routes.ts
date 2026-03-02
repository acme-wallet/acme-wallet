import { Home, Users, Workflow, Toolbox } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type SidebarRoute = {
  label: string;
  path: string;
  icon: LucideIcon;
  children?: SidebarRoute[];
};

export type SystemModule = 'factory' | 'human';

export const sidebarRoutesByModule: Record<SystemModule, SidebarRoute[]> = {
  factory: [
    { label: 'Home', path: '/factory/home', icon: Home },
    { label: 'Usuarios', path: '/factory/users', icon: Users },
    { label: 'PCP', path: '/factory/pcp', icon: Workflow },
    { label: 'Engenharias', path: '/factory/engenharias', icon: Toolbox },
  ],
  human: [
    { label: 'Home', path: '/human/home', icon: Home },
    { label: 'Usuarios', path: '/human/users', icon: Users },
    {
      label: 'PCP',
      path: '/human/pcp',
      icon: Workflow,
      children: [
        { label: 'Visao Geral', path: '/human/pcp', icon: Workflow },
        {
          label: 'Programacao',
          path: '/human/pcp/programacao',
          icon: Workflow,
        },
        {
          label: 'Apontamentos',
          path: '/human/pcp/apontamentos',
          icon: Workflow,
        },
      ],
    },
    { label: 'Equipe', path: '/human/rh', icon: Users },
  ],
};

export function getSidebarRoutes(module: SystemModule): SidebarRoute[] {
  return sidebarRoutesByModule[module];
}

export function getModuleFromPathname(pathname: string): SystemModule | null {
  if (pathname.startsWith('/factory')) return 'factory';
  if (pathname.startsWith('/human')) return 'human';
  return null;
}
