import { createFileRoute } from '@tanstack/react-router';
import { ModuleHomePage } from '@/features/shared-pages/module-home-page';

export const Route = createFileRoute('/_auth/factory/home/')({
  component: FactoryHomePage,
});

function FactoryHomePage() {
  return <ModuleHomePage module="factory" />;
}
