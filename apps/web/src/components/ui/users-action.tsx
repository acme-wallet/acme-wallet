import { EyeIcon, Pencil, Trash } from 'lucide-react';
import { Button } from './button';

type RowActionsProps<T> = {
  row: T;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  disableView?: boolean;
  disableEdit?: boolean;
  disableDelete?: boolean;
};

export function RowActions<T>({
  row,
  onView,
  onEdit,
  onDelete,
  disableView,
  disableEdit,
  disableDelete,
}: RowActionsProps<T>) {
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(row)}
          disabled={disableView}
        >
          <EyeIcon className="size-4" />
        </Button>
      )}

      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row)}
          disabled={disableEdit}
        >
          <Pencil className="size-4" />
        </Button>
      )}

      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row)}
          disabled={disableDelete}
          className="text-red-500"
        >
          <Trash className="size-4" />
        </Button>
      )}
    </div>
  );
}
