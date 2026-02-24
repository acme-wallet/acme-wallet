import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useGetUserByIdQuery } from '@/store/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppDialog } from '@/components/ui/app-dialog';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/users/$id/')({
  component: UserViewPage,
});

function UserViewPage() {
  const { id } = Route.useParams();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetUserByIdQuery(id);

  const navigate = useNavigate();

  if (isLoading) return <div>Carregando...</div>;
  if (!data) return <div>Usuário não encontrado</div>;

  function handleCancel() {
    setOpen(false);
    navigate({ to: '/users' });
  }

  return (
    <>
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Visualização</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Input value={data.name} disabled />
            <Input value={data.email} disabled />
          </CardContent>
          <div className="flex flex-row gap-6 justify-end mr-5">
            <Button
              type="button"
              variant="secondary"
              className="w-30 hover:cursor-pointer"
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
    </>
  );
}
