import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDeleteUserMutation, useGetUsersQuery } from '@/store/services/api';
import { RowActions } from '@/components/ui/users-action';
import { useQueryState } from 'nuqs';
import { PageHeader } from '@/components/ui/page-header';
import { AppDialog } from '@/components/ui/app-dialog';
import type { SystemModule } from '@/utils/sidebar-routes';

type Props = {
  module: SystemModule;
};

type User = {
  id: number;
  name: string;
  email: string;
};

const moduleToUsersPath: Record<
  SystemModule,
  '/factory/users' | '/human/users'
> = {
  factory: '/factory/users',
  human: '/human/users',
};

export function ModuleUsersPage({ module }: Props) {
  const [search, setSearch] = useQueryState('search');
  const { data, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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

  async function handleDeleteConfirm() {
    if (!userToDelete) return;

    await deleteUser(userToDelete.id).unwrap();
    setOpen(false);
    setUserToDelete(null);
    navigate({ to: moduleToUsersPath[module] });
  }

  async function handleView(user: User) {
    navigate({
      to: '/users/$id',
      params: { id: String(user.id) },
    });
  }

  async function handleEdit(user: User) {
    navigate({
      to: '/users/$id/edit',
      params: { id: String(user.id) },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        description="Gerencie os usuarios do sistema"
        actionLabel="Novo usuario"
        actionIcon={<Plus size={16} />}
        onAction={() => navigate({ to: '/users/new' })}
      />

      <Input
        placeholder="Pesquisar usuario..."
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
            header: 'Acoes',
            accessor: 'id',
            render: (user) => (
              <RowActions<User>
                row={user}
                onView={(u) => handleView(u)}
                onEdit={(u) => handleEdit(u)}
                onDelete={(u) => {
                  setUserToDelete(u);
                  setOpen(true);
                }}
              />
            ),
          },
        ]}
        pageSize={10}
        data={filteredData}
        isLoading={isLoading}
      />
      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title="Excluir registro"
        description="Ao excluir, todos os dados do usuario serao perdidos."
        confirmText="Confirmar"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
