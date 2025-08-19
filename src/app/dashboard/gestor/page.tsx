// src/app/dashboard/gestor/page.tsx
'use client'

import { useDashboard } from '@/hooks/useDashboard'
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics'
import { ClientsChart } from '@/components/dashboard/ClientsChart'
import { RecentClients } from '@/components/dashboard/RecentClients'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { DashboardError } from '@/components/dashboard/DashboardError'

export default function GestorDashboard() {
  const { stats, loading, error, refetch } = useDashboard()

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error || !stats) {
    return <DashboardError error={error || 'Erro desconhecido'} onRetry={refetch} />
  }

  return (
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

      <DashboardMetrics
        totalClients={stats.totalClients}
        newClientsThisMonth={stats.newClientsThisMonth}
        growthPercentage={stats.growthPercentage}
      />

      <ClientsChart data={stats.clientsPerMonth} />

      <RecentClients clients={stats.recentClients} />
    </div>
  )
}