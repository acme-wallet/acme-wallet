import { createRouter } from '@tanstack/react-router';
import { routeTree } from './route-tree.gen';
import { NotFoundPage } from './pages/not-found';

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
