import { createFileRoute } from '@tanstack/react-router';
import { ModuleUsersPage } from '@/features/shared-pages/module-users-page';

export const Route = createFileRoute('/_auth/factory/users/')({
  component: FactoryUsersPage,
});

function FactoryUsersPage() {
  return <ModuleUsersPage module="factory" />;
}
