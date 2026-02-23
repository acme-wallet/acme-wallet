import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { useGetUsersQuery } from '@/store/services/api';
import { UserActions } from '@/components/ui/users-action';
import { useQueryState } from 'nuqs';
import { PageHeader } from '@/components/ui/page-header';

type User = {
  id: number;
  name: string;
  email: string;
};

export const Route = createFileRoute('/_auth/users/')({
  component: UsersPage,
});

function UsersPage() {
  const [search, setSearch] = useQueryState('search');
  const { data, isLoading } = useGetUsersQuery();
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    if (!data) return [];

    const term = (search ?? '').toLowerCase();

    return data.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term),
    );
  }, [data, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários do sistema"
        actionLabel="Novo usuário"
        actionIcon={<Plus size={16} />}
        onAction={() => navigate({ to: '/users/new' })}
      />

      <Input
        placeholder="Pesquisar usuário..."
        value={search ?? ''}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <DataTable<User>
        columns={[
          { header: 'ID', accessor: 'id' },
          { header: 'Nome', accessor: 'name' },
          { header: 'Email', accessor: 'email' },
          {
            header: 'Ações',
            accessor: 'id',
            render: (user) => <UserActions user={user} />,
          },
        ]}
        pageSize={10}
        data={filteredData ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}