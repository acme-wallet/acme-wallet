import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const Route = createFileRoute("/login/")({
    component: LoginPage,
})

function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">

            <div className="hidden lg:flex items-center justify-center bg-muted">
                <img
                    src="/login-image.jpg"
                    alt="login"
                    className="h-full w-full object-cover"
                />
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
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="user">Usuário</Label>
                                <Input id="user" placeholder="Digite seu usuário" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input id="password" type="password" placeholder="Digite sua senha" />
                            </div>

                            <Button className="w-full mt-4">
                                Entrar
                            </Button>

                            <p className="text-sm text-muted-foreground text-center mt-4">
                                Caso tenha esquecido sua senha, procure o administrador do sistema.
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
