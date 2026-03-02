import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/factory/pcp/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/factory/pcp/"!</div>;
}
