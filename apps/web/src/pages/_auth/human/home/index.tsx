import { createFileRoute } from '@tanstack/react-router';
import { ModuleHomePage } from '@/features/shared-pages/module-home-page';

export const Route = createFileRoute('/_auth/human/home/')({
  component: HumanHomePage,
});

function HumanHomePage() {
  return <ModuleHomePage module="human" />;
}
