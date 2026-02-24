import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/users/$id')({
  component: EditUserPage,
});

function EditUserPage() {
  const { id } = Route.useParams();

  return <div>Editando usuário {id}</div>;
}
