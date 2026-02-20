import { EyeIcon, Pencil, Trash } from "lucide-react";
import { Button } from "./button";

type User = {
    id: number;
    name: string;
    email: string;
};

export function UserActions({ user }: { user: User }) {
    function handleView() {
        console.log("view", user.id)
    }

    function handleEdit() {
        console.log("edit", user.id)
    }

    function handleDelete() {
        console.log("delete", user.id)
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleView}>
                <EyeIcon className="size-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={handleEdit}>
                <Pencil className="size-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-red-500"
            >
                <Trash className="size-4" />
            </Button>
        </div>
    )
}