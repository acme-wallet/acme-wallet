import {
  Outlet,
  createFileRoute,
  useRouterState,
} from '@tanstack/react-router';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { Toaster } from '@/components/ui/sonner';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isMainRoute = pathname === '/main' || pathname === '/main/';

  if (isMainRoute) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  return (
    <DashboardLayout>
      <Outlet />
      <Toaster />
    </DashboardLayout>
  );
}
