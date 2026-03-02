import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { BrainIcon } from '@/components/ui/brain';
import { WorkflowIcon } from '@/components/ui/workflow';

export const Route = createFileRoute('/_auth/main/')({
  component: MainPage,
});

function MainPage() {
  const navigate = useNavigate();

  const redirectToFactory = () => {
    navigate({ to: '/factory' });
  };

  const redirectToHuman = () => {
    navigate({ to: '/human' });
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-linear-to-br from-[#F25C54] to-[#1F2A44] p-6">
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#F25C54]/30 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#1F2A44]/30 blur-3xl animate-pulse" />

      <div className="relative z-10 flex items-center justify-center gap-10">
        <Card
          className="w-80 hover:bg-muted hover:cursor-pointer border-2 border-gray-300"
          onClick={redirectToFactory}
        >
          <CardContent className="flex h-24 items-center justify-center text-lg font-bold text-gray-700">
            <div className="flex flex-col gap-4 items-center">
              <BrainIcon className="w-8 h-8" />
              <span className="text-xl">Factory</span>
            </div>
          </CardContent>
        </Card>
        <Card
          className="w-80 hover:bg-muted hover:cursor-pointer border-2 border-gray-300"
          onClick={redirectToHuman}
        >
          <CardContent className="flex h-24 items-center justify-center text-lg font-bold text-gray-700">
            <div className="flex flex-col gap-4 items-center justify-center">
              <WorkflowIcon className="w-8 h-8" />
              <span className="text-xl">Human</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
