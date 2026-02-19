import { Home, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type SidebarRoute = {
    label: string
    path: string
    icon: LucideIcon
}

export const sidebarRoutes: SidebarRoute[] = [
    {
        label: "Home",
        path: "/home",
        icon: Home,
    },
    {
        label: "Usuários",
        path: "/users",
        icon: Users,
    },
]
