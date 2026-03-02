import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/factory/engenharias/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/factory/engenharias/"!</div>;
}
