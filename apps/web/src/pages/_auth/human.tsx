import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/human')({
  component: HumanModule,
});

function HumanModule() {
  return <Outlet />;
}
