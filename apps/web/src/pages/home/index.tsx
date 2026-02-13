import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/")({
    component: () => <div>Home</div>,
});