import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notfound/")({
    component: () => <div>404 - Página não encontrada</div>,
});