'use client'

// ==========================================
// FLYMILHAS - DASHBOARD GESTOR (TESTE INTEGRAÇÃO)
// ==========================================

import { useDashboardData } from '@/hooks/useDashboardData'
import { AppLayout } from '@/components/app-layout'

// Importações condicionais - testar se os componentes existem
let DashboardMetrics: any, ClientsChart: any, RecentClients: any, DashboardSkeleton: any, DashboardError: any, useDashboard: any

try {
  const dashboardComponents = require('@/components/dashboard/DashboardMetrics')
  DashboardMetrics = dashboardComponents.DashboardMetrics
} catch (e) {
  console.log('DashboardMetrics component not found')
}

try {
  const clientsChart = require('@/components/dashboard/ClientsChart')
  ClientsChart = clientsChart.ClientsChart
} catch (e) {
  console.log('ClientsChart component not found')
}

try {
  const recentClients = require('@/components/dashboard/RecentClients')
  RecentClients = recentClients.RecentClients
} catch (e) {
  console.log('RecentClients component not found')
}

try {
  const dashboardSkeleton = require('@/components/dashboard/DashboardSkeleton')
  DashboardSkeleton = dashboardSkeleton.DashboardSkeleton
} catch (e) {
  console.log('DashboardSkeleton component not found')
}

try {
  const dashboardError = require('@/components/dashboard/DashboardError')
  DashboardError = dashboardError.DashboardError
} catch (e) {
  console.log('DashboardError component not found')
}

try {
  const useDashboardHook = require('@/hooks/useDashboard')
  useDashboard = useDashboardHook.useDashboard
} catch (e) {
  console.log('useDashboard hook not found')
}

// Componente de fallback para loading
function LoadingFallback() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    </div>
  )
}

// Componente de fallback para erro
function ErrorFallback({ error, onRetry }: { error: string, onRetry?: () => void }) {
  return (
    <div className="p-6">
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
        <h2 className="text-lg font-semibold text-destructive mb-2">Erro no Dashboard</h2>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          >
            Tentar Novamente
          </button>
        )}
      </div>
    </div>
  )
}

export default function GestorDashboard() {
  // Usar o hook existente se disponível
  const existingDashboard = useDashboard ? useDashboard() : { stats: null, loading: false, error: null, refetch: () => {} }
  
  // Usar o novo hook para dados de contas
  const { 
    metrics: accountsMetrics, 
    companyDistribution, 
    topClients,
    loading: accountsLoading, 
    error: accountsError 
  } = useDashboardData()

  // Estados combinados
  const loading = existingDashboard.loading || accountsLoading
  const error = existingDashboard.error || accountsError

  console.log('🔍 Dashboard state:', {
    existingStats: existingDashboard.stats,
    accountsMetrics,
    companyDistribution: companyDistribution.length,
    topClients: topClients.length,
    loading,
    error
  })

  if (loading) {
    return (
      <AppLayout>
        {DashboardSkeleton ? <DashboardSkeleton /> : <LoadingFallback />}
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        {DashboardError ? 
          <DashboardError error={error} onRetry={existingDashboard.refetch} /> :
          <ErrorFallback error={error} onRetry={existingDashboard.refetch} />
        }
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

        {/* Métricas de Clientes (se o componente existir) */}
        {DashboardMetrics && existingDashboard.stats && (
          <DashboardMetrics
            totalClients={existingDashboard.stats.totalClients}
            newClientsThisMonth={existingDashboard.stats.newClientsThisMonth}
            growthPercentage={existingDashboard.stats.growthPercentage}
          />
        )}

        {/* Métricas de Contas de Milhas (novo) */}
        {accountsMetrics && (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                ✈️ Métricas de Contas de Milhas
              </h3>
              <p className="text-sm text-muted-foreground">
                Visão geral das contas e saldos gerenciados
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-lg border bg-blue-50 text-blue-600 border-blue-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-70 uppercase">Total de Contas</p>
                      <p className="text-2xl font-bold mt-1">
                        {accountsMetrics.totalAccounts.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs opacity-60 mt-1">Contas ativas</p>
                    </div>
                    <div className="text-2xl opacity-70">📊</div>
                  </div>
                </div>
                
                <div className="rounded-lg border bg-green-50 text-green-600 border-green-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-70 uppercase">Total de Milhas</p>
                      <p className="text-2xl font-bold mt-1">
                        {accountsMetrics.totalMiles.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs opacity-60 mt-1">Saldo consolidado</p>
                    </div>
                    <div className="text-2xl opacity-70">✈️</div>
                  </div>
                </div>
                
                <div className="rounded-lg border bg-purple-50 text-purple-600 border-purple-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-70 uppercase">Média por Cliente</p>
                      <p className="text-2xl font-bold mt-1">
                        {accountsMetrics.averageMilesPerClient.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs opacity-60 mt-1">Milhas por cliente</p>
                    </div>
                    <div className="text-2xl opacity-70">📈</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout em Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Gráfico de clientes (se existir) */}
          {ClientsChart && existingDashboard.stats?.clientsPerMonth && (
            <ClientsChart data={existingDashboard.stats.clientsPerMonth} />
          )}

          {/* Distribuição por Companhia (novo) */}
          {companyDistribution.length > 0 && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  🏢 Distribuição por Companhia
                </h3>
                <p className="text-sm text-muted-foreground">
                  Distribuição de milhas por programa
                </p>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  {companyDistribution.map((company) => (
                    <div 
                      key={company.company} 
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: company.color }}
                        />
                        <div>
                          <p className="font-medium">{company.company}</p>
                          <p className="text-sm text-muted-foreground">
                            {company.accountCount} contas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {company.balance.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {company.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Segunda linha de componentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Clientes recentes (se existir) */}
          {RecentClients && existingDashboard.stats?.recentClients && (
            <RecentClients clients={existingDashboard.stats.recentClients} />
          )}

          {/* Top Clientes por Milhas (novo) */}
          {topClients.length > 0 && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  🏆 Top Clientes por Milhas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Clientes com maiores saldos
                </p>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  {topClients.slice(0, 5).map((client, index) => (
                    <div key={client.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.accountCount} contas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {client.totalMiles.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm text-muted-foreground">milhas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status dos componentes - debug */}
        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-lg border bg-muted/20 p-4">
            <details>
              <summary className="cursor-pointer font-medium mb-2">
                🔧 Status dos Componentes
              </summary>
              <div className="bg-background rounded p-4 mt-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Componentes Existentes:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>✅ AppLayout: Funcionando</li>
                      <li>{DashboardMetrics ? '✅' : '❌'} DashboardMetrics</li>
                      <li>{ClientsChart ? '✅' : '❌'} ClientsChart</li>
                      <li>{RecentClients ? '✅' : '❌'} RecentClients</li>
                      <li>{DashboardSkeleton ? '✅' : '❌'} DashboardSkeleton</li>
                      <li>{DashboardError ? '✅' : '❌'} DashboardError</li>
                      <li>{useDashboard ? '✅' : '❌'} useDashboard hook</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Novos Componentes:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>✅ useDashboardData hook</li>
                      <li>✅ AccountsMetrics (inline)</li>
                      <li>✅ CompanyDistribution (inline)</li>
                      <li>✅ TopClients (inline)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    </AppLayout>
  )
}