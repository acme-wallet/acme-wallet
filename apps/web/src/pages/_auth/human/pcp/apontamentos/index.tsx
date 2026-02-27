import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/human/pcp/apontamentos/')({
  component: HumanPcpApontamentosPage,
});

function HumanPcpApontamentosPage() {
  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">
        Human - PCP Apontamentos
      </h1>
      <p className="text-sm text-muted-foreground">
        Pagina de apontamentos do PCP
      </p>
    </div>
  );
}
