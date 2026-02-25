import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useGetUserByIdQuery } from '@/store/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppDialog } from '@/components/ui/app-dialog';
import { useState } from 'react';
import { AsyncState } from '@/components/ui/async-state';

export const Route = createFileRoute('/_auth/users/$id/')({
  component: UserViewPage,
});

function UserViewPage() {
  const { id } = Route.useParams();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetUserByIdQuery(id);
  const navigate = useNavigate();
  const user = data!;

  function handleCancel() {
    setOpen(false);
    navigate({ to: '/users' });
  }

  return (
    <AsyncState
      isLoading={isLoading}
      isEmpty={!data}
      emptyText="Usuário não encontrado"
    >
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Visualização do usuário</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Input value={user?.name} disabled />
            <Input value={user?.email} disabled />
          </CardContent>
          <div className="flex flex-row gap-6 justify-end mr-5">
            <Button
              type="button"
              variant="secondary"
              className="w-[7.5rem] hover:cursor-pointer"
              onClick={() => setOpen(true)}
            >
              Voltar
            </Button>
          </div>
        </Card>

        <AppDialog
          open={open}
          onOpenChange={setOpen}
          title="Retornar para a lista de usuários"
          confirmText="Sim"
          onConfirm={() => handleCancel()}
        />
      </div>
    </AsyncState>
  );
}
