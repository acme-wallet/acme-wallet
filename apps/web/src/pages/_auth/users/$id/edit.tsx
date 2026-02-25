import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import {
  api,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from '@/store/services/api';
import { store } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppDialog } from '@/components/ui/app-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/ui/form-input';
import { CreateUserSchema } from '@repo/schemas';
import { AsyncState } from '@/components/ui/async-state';

export const Route = createFileRoute('/_auth/users/$id/edit')({
  component: EditUserPage,
  loader: ({ params }) => {
    return store.dispatch(
      api.endpoints.getUserById.initiate(String(params.id)),
    );
  },
});

type FormData = z.infer<typeof CreateUserSchema>;

function EditUserPage() {
  const { id } = Route.useParams();
  const userId = String(id);
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetUserByIdQuery(userId);
  const [updateUser, { isLoading: saving }] = useUpdateUserMutation();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(CreateUserSchema),
    mode: 'onChange',
  });

  async function onSubmit(data: FormData) {
    await updateUser({
      id: userId,
      ...data,
    }).unwrap();

    navigate({ to: '/users' });
  }

  function handleCancel() {
    setOpen(false);
    navigate({ to: '/users' });
  }

  const canSave = isValid && isDirty && !saving;

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  return (
    <AsyncState
      isLoading={isLoading}
      isEmpty={!user}
      emptyText="Usuário não encontrado"
    >
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Editação do usuário</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="flex flex-wor gap-5 mb-10">
              <FormInput<FormData>
                label="Nome"
                name="name"
                register={register}
                error={errors.name?.message}
                placeholder="Nome"
                width="full"
              />

              <FormInput<FormData>
                label="Email"
                name="email"
                register={register}
                error={errors.email?.message}
                placeholder="Email"
                width="full"
              />
            </CardContent>

            <div className="flex gap-6 justify-end mr-5 pb-5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(true)}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={!canSave}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Card>

        <AppDialog
          open={open}
          onOpenChange={setOpen}
          title="Cancelar edição?"
          description="Tem certeza que deseja cancelar a edição? As alterações não salvas serão perdidas."
          confirmText="Sim"
          onConfirm={handleCancel}
        />
      </div>
    </AsyncState>
  );
}
