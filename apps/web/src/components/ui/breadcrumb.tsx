import { useRouterState, Link } from '@tanstack/react-router';

export function Breadcrumb() {
  const matches = useRouterState({ select: (s) => s.matches });

  const breadcrumbs = matches
    .filter((match) => match.pathname !== '/')
    .map((match) => {
      const path = match.pathname;
      const label =
        match.pathname.split('/').pop()?.replace('_auth', '') || 'Home';

      return {
        label: label.charAt(0).toUpperCase() + label.slice(1),
        path,
      };
    });

  return (
    <nav className="text-sm text-muted-foreground flex items-center gap-2">
      <Link to="/home" className="hover:text-foreground">
        Home
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.path} className="flex items-center gap-2">
          <span>/</span>
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
