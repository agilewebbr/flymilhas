'use client'

import { useDashboard } from '@/hooks/useDashboard'
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics'
import { ClientsChart } from '@/components/dashboard/ClientsChart'
import { RecentClients } from '@/components/dashboard/RecentClients'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { DashboardError } from '@/components/dashboard/DashboardError'
import { AppLayout } from '@/components/app-layout'

export default function GestorDashboard() {
  const { stats, loading, error, refetch } = useDashboard()

  if (loading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    )
  }

  if (error || !stats) {
    return (
      <AppLayout>
        <DashboardError error={error || 'Erro desconhecido'} onRetry={refetch} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard do Gestor</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio de milhas</p>
        </header>

        {/* Métricas principais */}
        <DashboardMetrics
          totalClients={stats.totalClients}
          newClientsThisMonth={stats.newClientsThisMonth}
          growthPercentage={stats.growthPercentage}
        />

        {/* Gráfico de clientes */}
        <ClientsChart data={stats.clientsPerMonth} />

        {/* Clientes recentes */}
        <RecentClients clients={stats.recentClients} />
      </div>
    </AppLayout>
  )
}