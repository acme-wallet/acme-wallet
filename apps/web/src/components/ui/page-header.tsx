import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

type Props = {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: ReactNode;
};

export function PageHeader({
    title,
    description,
    actionLabel,
    onAction,
    actionIcon,
}: Props) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold">{title}</h1>

                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>

            {actionLabel && onAction && (
                <Button className="flex items-center gap-2" onClick={onAction}>
                    {actionIcon}
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}