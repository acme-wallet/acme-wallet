import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDeleteUserMutation, useGetUsersQuery } from '@/store/services/api';
import { RowActions } from '@/components/ui/users-action';
import { useQueryState } from 'nuqs';
import { PageHeader } from '@/components/ui/page-header';
import { AppDialog } from '@/components/ui/app-dialog';

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
  const [deleteUser] = useDeleteUserMutation();
  const [open, setOpen] = useState(false);

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

  async function handleCancel(u: User) {
    deleteUser(u.id).unwrap();
    setOpen(false);
    navigate({ to: '/users' });
  }

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
            render: (user) => (
              <RowActions<User>
                row={user}
                onView={(u) =>
                  navigate({ to: '/users/$id', params: { id: String(u.id) } })
                }
                onEdit={(u) =>
                  navigate({
                    to: '/users/$id/edit',
                    params: { id: String(u.id) },
                  })
                }
                onDelete={() => setOpen(true)}
              />
            ),
          },
        ]}
        pageSize={10}
        data={filteredData ?? []}
        isLoading={isLoading}
      />
      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title="Excluir registro"
        description="Ao excluir, todos os dados do usuário serão perdidos."
        confirmText="Confirmar"
        onConfirm={() => handleCancel(filteredData[0])}
      />
    </div>
  );
}
