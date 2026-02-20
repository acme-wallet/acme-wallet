import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateUserSchema } from '@repo/schemas';
import { FormInput } from '@/components/ui/form-input';
import { useCreateUserMutation } from '@/store/services/api';
import { toast } from 'sonner';
import { useState } from 'react';
import { AppDialog } from '@/components/ui/app-dialog';

export const Route = createFileRoute('/_auth/users/new')({
  component: NewUserPage,
});

type FormData = z.infer<typeof CreateUserSchema>;

function NewUserPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [createUser] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(CreateUserSchema),
  });

  async function onSubmit(data: FormData) {
    try {
      await createUser(data).unwrap();
      toast.success('Usuário criado com sucesso!', { position: 'top-right' });
      navigate({ to: '/users' });
    } catch (error: unknown) {
      console.error(error);
      toast.error(`Erro ao criar usuário`, { position: 'top-right' });
    }
  }
  function handleCancel() {
    setOpen(false);
    navigate({ to: '/users' });
  }

  return (
    <div className="max-full-lg">
      <Card>
        <CardHeader>
          <CardTitle>Novo usuário</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Nome"
              name="name"
              register={register}
              error={errors.name?.message}
              placeholder="Digite o nome"
            />

            <FormInput
              label="Email"
              name="email"
              register={register}
              error={errors.email?.message}
              placeholder="Digite o email"
            />

            <div className="flex flex-row gap-6 justify-end">
              <Button
                type="button"
                variant="secondary"
                className="w-20 hover:cursor-pointer"
                onClick={() => setOpen(true)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-20 hover:cursor-pointer"
              >
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title="Cancelar cadastro"
        description="Ao cancelar, todos os dados inseridos serão perdidos."
        confirmText="Confirmar"
        onConfirm={handleCancel}
      />
    </div>
  );
}
