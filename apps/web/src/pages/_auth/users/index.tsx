import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus, Trash, Pencil, EyeIcon } from 'lucide-react';
import { useState } from 'react';
import { useGetUsersQuery } from '@/store/services/api';

type User = {
  id: number;
  name: string;
  email: string;
};

export const Route = createFileRoute('/_auth/users/')({
  component: UsersPage,
});

function UsersPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetUsersQuery();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>

        <Button
          className="flex items-center gap-2"
          onClick={() => navigate({ to: '/users/new' })}
        >
          <Plus size={16} />
          Novo usuário
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Pesquisar usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <DataTable<User>
        columns={[
          { header: 'ID', accessor: 'id' },
          { header: 'Nome', accessor: 'name' },
          { header: 'Email', accessor: 'email' },
          {
            header: 'Ações',
            accessor: 'id',
            render: () => (
              <>
                <div className="flex flex-row gap-10">
                  <EyeIcon className="hover:cursor-pointer" />
                  <Pencil className="hover:cursor-pointer" />
                  <Trash className="hover:cursor-pointe" />
                </div>
              </>
            ),
          },
        ]}
        pageSize={10}
        data={data ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
