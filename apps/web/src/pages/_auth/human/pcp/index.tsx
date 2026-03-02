import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/human/pcp/')({
  component: HumanPcpPage,
});

function HumanPcpPage() {
  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">Human - PCP</h1>
      <p className="text-sm text-muted-foreground">Visao geral do PCP</p>
    </div>
  );
}
