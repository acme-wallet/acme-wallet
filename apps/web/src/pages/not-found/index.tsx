import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/not-found/')({
  component: () => <div>404 - Página não encontrada</div>,
});
