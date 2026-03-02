import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Logo = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <style>{`
        .bg-bar { fill: #1E2337; }
        .rocket-body { fill: #FF5E5E; }
        .rocket-window { fill: #FFFFFF; }
      `}</style>
    </defs>
    <polygon points="55,30 85,30 70,110 40,110" className="bg-bar" />
    <g transform="translate(90, 25)">
      <path
        d="M40,0 C65,0 80,40 80,85 L0,85 C0,40 15,0 40,0 Z"
        className="rocket-body"
      />
      <path d="M0,70 L-10,95 C0,95 10,90 15,85 L0,70" className="rocket-body" />
      <path
        d="M80,70 L90,95 C80,95 70,90 65,85 L80,70"
        className="rocket-body"
      />
      <circle cx="40" cy="35" r="8" className="rocket-window" />
    </g>
  </svg>
);

export const Route = createFileRoute('/login/')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({ to: '/main' });
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-linear-to-br from-[#F25C54] to-[#1F2A44] p-6">
      <div className="h-full grid lg:grid-cols-2 gap-20 bg-transparent overflow-hidden">
        <div className="flex items-center justify-center bg-transparent mt-20">
          <Logo className="h-full w-full object-cover flex justify-center" />
        </div>

        <div className="flex items-center justify-center p-6">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="flex flex-col justify-center items-center">
              <CardTitle className="text-2xl">Acessar sistema</CardTitle>
              <CardDescription>
                Informe usuário e senha para continuar
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="user">Usuário</Label>
                  <Input id="user" placeholder="Digite seu usuário" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                  />
                </div>

                <Button className="w-full mt-4" type="submit">
                  Entrar
                </Button>

                <p className="text-sm text-muted-foreground text-center mt-4">
                  Caso tenha esquecido sua senha, procure o administrador do
                  sistema.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
