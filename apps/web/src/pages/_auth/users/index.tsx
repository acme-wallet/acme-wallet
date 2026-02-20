import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useGetUsersQuery } from '@/store/services/api';
import { UserActions } from '@/components/ui/users-action';

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

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

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
            render: (user) => <UserActions user={user} />
          },
        ]}
        pageSize={10}
        data={filteredData ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
