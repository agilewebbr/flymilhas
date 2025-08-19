'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Skeleton, SkeletonCard, SkeletonMetrics, Spinner } from '@/components/ui/skeleton'
import { Search, Plus, Settings } from 'lucide-react'

export default function TestComponents() {
  const [loading, setLoading] = useState(false)

  const handleTest = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Teste de Componentes UI</h1>
          <p className="text-muted-foreground">Validação completa do design system</p>
        </header>

        {/* Input Component */}
        <Card>
          <CardHeader>
            <CardTitle>🔤 Input Component</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Nome do cliente..." />
              <Input type="email" placeholder="email@exemplo.com" />
              <Input type="password" placeholder="Senha" />
              <Input disabled placeholder="Campo desabilitado" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Buscar com ícone..." />
            </div>
          </CardContent>
        </Card>

        {/* Badge Component */}
        <Card>
          <CardHeader>
            <CardTitle>🏷️ Badge Component</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secundário</Badge>
              <Badge variant="destructive">Erro</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Sucesso</Badge>
              <Badge variant="warning">Aviso</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Modal/Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>🪟 Modal System</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Abrir Modal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha os dados abaixo para cadastrar um novo cliente.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="Nome completo" />
                  <Input type="email" placeholder="Email" />
                  <Input placeholder="Telefone" />
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Cliente</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Sheet (Mobile) */}
        <Card>
          <CardHeader>
            <CardTitle>📱 Sheet Mobile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Sheet Direita</Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Configurações</SheetTitle>
                    <SheetDescription>
                      Ajuste suas preferências aqui.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome de usuário</label>
                      <Input placeholder="Seu nome" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="seu@email.com" />
                    </div>
                  </div>
                  <SheetFooter>
                    <Button>Salvar alterações</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Sheet Esquerda</Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Menu Lateral</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                      Conteúdo do menu lateral aqui.
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </Card>

        {/* Loading States */}
        <Card>
          <CardHeader>
            <CardTitle>⏳ Loading States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handleTest} disabled={loading}>
                {loading ? <Spinner className="mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
                {loading ? 'Carregando...' : 'Testar Loading'}
              </Button>
            </div>

            {loading ? (
              <div className="space-y-6">
                <SkeletonMetrics />
                <SkeletonCard />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-sm text-muted-foreground">Total de Clientes</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">89</div>
                      <p className="text-sm text-muted-foreground">Novos Este Mês</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">12.5%</div>
                      <p className="text-sm text-muted-foreground">Crescimento</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}