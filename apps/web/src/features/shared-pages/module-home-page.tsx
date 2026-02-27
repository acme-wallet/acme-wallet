import type { SystemModule } from '@/utils/sidebar-routes';

type Props = {
  module: SystemModule;
};

const moduleTitle: Record<SystemModule, string> = {
  factory: 'Factory',
  human: 'Human',
};

export function ModuleHomePage({ module }: Props) {
  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">
        Home - {moduleTitle[module]}
      </h1>
      <p className="text-sm text-muted-foreground">
        Pagina inicial compartilhada entre modulos.
      </p>
    </div>
  );
}
