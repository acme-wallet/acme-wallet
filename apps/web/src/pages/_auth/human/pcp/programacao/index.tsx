import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/human/pcp/programacao/')({
  component: HumanPcpProgramacaoPage,
});

function HumanPcpProgramacaoPage() {
  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">
        Human - PCP Programacao
      </h1>
      <p className="text-sm text-muted-foreground">
        Pagina de programacao do PCP
      </p>
    </div>
  );
}
