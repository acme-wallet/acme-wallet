import { createFileRoute } from '@tanstack/react-router';
import { ModuleUsersPage } from '@/features/shared-pages/module-users-page';

export const Route = createFileRoute('/_auth/human/users/')({
  component: HumanUsersPage,
});

function HumanUsersPage() {
  return <ModuleUsersPage module="human" />;
}
