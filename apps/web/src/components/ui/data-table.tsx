import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
  keyAccessor?: keyof T | ((row: T) => string | number);
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
};

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = 'Nenhum registro encontrado',
  pageSize = 5,
}: Props<T>) {
  const [page, setPage] = useState(1);

  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const paginatedData = data.slice(start, end);

  const tableKeyAccessor: keyof T | ((row: T) => string | number) =
    (columns.find((c) => c.keyAccessor)?.keyAccessor as
      | keyof T
      | ((row: T) => string | number)) ?? columns[0].accessor;

  function nextPage() {
    if (page < totalPages) setPage(page + 1);
  }

  function prevPage() {
    if (page > 1) setPage(page - 1);
  }

  const getKey = (row: T) => {
    const keyAccessor = tableKeyAccessor;
    if (typeof keyAccessor === 'function') {
      return keyAccessor(row);
    }
    return row[keyAccessor] as unknown as string | number;
  };

  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, colIndex) => (
              <TableHead key={`${String(col.accessor)}-${colIndex}`}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-10">
                Carregando...
              </TableCell>
            </TableRow>
          )}

          {!isLoading && paginatedData.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-10">
                <img src="/no-data.svg" className="mx-auto mb-2 h-40" />
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            paginatedData.map((row, rowIndex) => (
              <TableRow key={`${String(getKey(row))}-${start + rowIndex}`}>
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={`${String(col.accessor)}-${start + rowIndex}-${colIndex}`}
                    className={col.className}
                  >
                    {col.render
                      ? col.render(row)
                      : (row[col.accessor] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">{total} registros</div>

          <div className="flex items-center gap-4">
            <span className="text-sm">
              Página {page} de {totalPages}
            </span>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={prevPage}
                disabled={page === 1}
              >
                {'<'}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={nextPage}
                disabled={page === totalPages}
              >
                {'>'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
