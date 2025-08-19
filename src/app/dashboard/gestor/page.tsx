// src/app/dashboard/gestor/page.tsx
'use client'

import { useDashboard } from '@/hooks/useDashboard'
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics'
import { ClientsChart } from '@/components/dashboard/ClientsChart'
import { RecentClients } from '@/components/dashboard/RecentClients'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { DashboardError } from '@/components/dashboard/DashboardError'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { formatCurrency, formatMiles, cn } from '@/lib/utils'

export default function GestorDashboard() {
  const { stats, loading, error, refetch } = useDashboard()

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error || !stats) {
    return <DashboardError error={error || 'Erro desconhecido'} onRetry={refetch} />
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard do Gestor</h1>
          <p className="text-muted-foreground mt-1">Visão geral do seu negócio de milhas</p>
        </header>
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Gestor</h1>
          <p className="text-gray-600 mt-1">Visão geral do seu negócio de milhas</p>
        </header>

        <div className="bg-primary text-primary-foreground p-4 rounded-lg animate-fade-in mb-4">
          🎨 Design System Funcionando!
        </div>
        <div className="bg-secondary text-secondary-foreground p-4 rounded-lg">
          🌟 Tokens configurados com sucesso!
        </div>

        <div className="space-y-6 p-6">
          {/* Teste dos Componentes Card */}
          <Card className="fade-in">
            <CardHeader>
              <CardTitle>🎨 Design System v2.0</CardTitle>
              <CardDescription>
                Teste completo dos novos componentes e utilitários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-small">Formatação de Moeda:</p>
                  <p className="text-large">{formatCurrency(15750.50)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-small">Formatação de Milhas:</p>
                  <p className="text-large">{formatMiles(1250000)} milhas</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="space-x-2">
              <Button variant="default">Primário</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
            </CardFooter>
          </Card>

          {/* Teste Dark Mode */}
          <Card className="slide-in">
            <CardContent className="p-6">
              <div className="flex-between">
                <p>Teste o dark mode com F12 → Console:</p>
                <code className="bg-muted p-2 rounded text-sm">
                  document.body.classList.toggle('dark')
                </code>
              </div>
            </CardContent>
          </Card>
        </div>

        <DashboardMetrics
          totalClients={stats.totalClients}
          newClientsThisMonth={stats.newClientsThisMonth}
          growthPercentage={stats.growthPercentage}
        />

        <ClientsChart data={stats.clientsPerMonth} />

        <RecentClients clients={stats.recentClients} />
      </div>
    </div>
  </AppLayout>
  )
}