import { Outlet, createRootRoute } from '@tanstack/react-router';
import { NotFoundPage } from './not-found';

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});
