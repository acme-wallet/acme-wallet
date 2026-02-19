import { sidebarRoutes } from "@/utils/sidebar-routes"
import { Link } from "@tanstack/react-router"

type Props = {
    open: boolean
}

export function Sidebar({ open }: Props) {
    return (
        <aside
            className={`
        h-screen bg-card border-r transition-all duration-300
        ${open ? "w-64" : "w-16"}
      `}
        >
            <img src="/login-image.jpg" alt="Logo" className="w-20 h-20 mx-auto" />

            <nav className="p-2 space-y-2">

                {sidebarRoutes.map((route) => {
                    const Icon = route.icon
                    return (
                        <Link
                            key={route.path}
                            to={route.path}
                            className={`
                flex items-center rounded transition-colors hover:bg-muted hover:rounded-md
                ${open ? "gap-2 px-3 py-2" : "justify-center py-3"}
              `}
                        >
                            <Icon size={18} />
                            {open && <span>{route.label}</span>}
                        </Link>
                    )
                })}

            </nav>
        </aside>
    )
}
