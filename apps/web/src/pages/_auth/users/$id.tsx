import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/users/$id')({
  component: UserLayout,
});

function UserLayout() {
  return <Outlet />;
}
