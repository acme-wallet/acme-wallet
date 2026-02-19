import { useState } from "react"
import { Header } from "@/components/ui/header"
import { Sidebar } from "@/components/ui/sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true)

    return (
        <div className="w-screen h-screen flex">

            <Sidebar open={open} />
            <div className="flex-1 flex flex-col">
                <Header onToggleSidebar={() => setOpen(!open)} />
                <main className="flex-1 p-6 rounded-md w-full">
                    {children}
                </main>

            </div>
        </div>
    )
}
