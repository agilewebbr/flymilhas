'use client'

import { useDashboardData } from '@/hooks/useDashboardData'

// Import seguro do AppLayout
let AppLayout: any
try {
  const appLayoutModule = require('@/components/app-layout')
  AppLayout = appLayoutModule.AppLayout
} catch (e) {
  // Fallback caso AppLayout não exista
  AppLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">{children}</div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    </div>
  )
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="p-6">
      <div className="rounded-lg border border-red-300 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Erro no Dashboard</h2>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  )
}

export default function GestorDashboard() {
  // Usar apenas o hook que sabemos que existe
  const { 
    metrics, 
    companyDistribution, 
    topClients,
    loading, 
    error 
  } = useDashboardData()

  if (loading) {
    return (
      <AppLayout>
        <LoadingSpinner />
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <ErrorDisplay error={error} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard do Gestor</h1>
          <p className="text-gray-600">Visão geral do seu negócio de milhas</p>
        </header>

        {/* Métricas de Contas de Milhas */}
        {metrics && (
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Métricas de Contas de Milhas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Visão geral das contas e saldos gerenciados
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 uppercase">Total de Contas</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {metrics.totalAccounts.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">Contas ativas</p>
                    </div>
                    <div className="text-2xl text-blue-600">📊</div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 uppercase">Total de Milhas</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">
                        {metrics.totalMiles.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-green-600 mt-1">Saldo consolidado</p>
                    </div>
                    <div className="text-2xl text-green-600">✈️</div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700 uppercase">Média por Cliente</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">
                        {metrics.averageMilesPerClient.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">Milhas por cliente</p>
                    </div>
                    <div className="text-2xl text-purple-600">📈</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid de componentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Distribuição por Companhia */}
          {companyDistribution.length > 0 && (
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Distribuição por Companhia</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Distribuição de milhas por programa
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {companyDistribution.map((company) => (
                    <div 
                      key={company.company} 
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: company.color }}
                        />
                        <div>
                          <p className="font-medium">{company.company}</p>
                          <p className="text-sm text-gray-600">
                            {company.accountCount} contas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {company.balance.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {company.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total Geral</span>
                    <span>
                      {companyDistribution.reduce((sum, company) => sum + company.balance, 0).toLocaleString('pt-BR')} milhas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Clientes por Milhas */}
          {topClients.length > 0 && (
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Top Clientes por Milhas</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Clientes com maiores saldos
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topClients.slice(0, 5).map((client, index) => (
                    <div key={client.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-600">
                            {client.accountCount} contas • {client.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {client.totalMiles.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-600">milhas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}