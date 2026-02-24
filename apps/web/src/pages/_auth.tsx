import { Outlet, createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { Toaster } from '@/components/ui/sonner';

export const Route = createFileRoute('/_auth')({
  component: () => (
    <DashboardLayout>
      <Outlet />
      <Toaster />
    </DashboardLayout>
  ),
});
