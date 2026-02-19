import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
};

const usersMock: User[] = [
  { id: 1, name: 'João', email: 'joao@email.com' },
  { id: 2, name: 'Maria', email: 'maria@email.com' },
  { id: 3, name: 'Carlos', email: 'carlos@email.com' },
  { id: 4, name: 'Ana', email: 'ana@email.com' },
  { id: 5, name: 'Pedro', email: 'pedro@email.com' },
  { id: 6, name: 'Fernanda', email: 'fernanda@email.com' },
  { id: 7, name: 'Lucas', email: 'lucas@email.com' },
  { id: 8, name: 'Juliana', email: 'juliana@email.com' },
  { id: 9, name: 'Lucas', email: 'lucas@email.com' },
  { id: 10, name: 'Juliana', email: 'juliana@email.com' },
  { id: 11, name: 'Lucas', email: 'lucas@email.com' },
  { id: 12, name: 'Juliana', email: 'juliana@email.com' },
  { id: 13, name: 'Lucas', email: 'lucas@email.com' },
  { id: 14, name: 'Juliana', email: 'juliana@email.com' },
];

export const Route = createFileRoute('/_auth/users/')({
  component: UsersPage,
});

function UsersPage() {
  const [search, setSearch] = useState('');

  const filteredUsers = usersMock.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>

        <Button className="flex items-center gap-2">
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
              <Button
                size="sm"
                variant="outline"
                className="hover:cursor-pointer hover:bg-gray-200"
              >
                Editar
              </Button>
            ),
          },
        ]}
        data={filteredUsers}
        pageSize={10}
      />
    </div>
  );
}
