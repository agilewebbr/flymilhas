// ==========================================
// FLYMILHAS - ACCOUNTS METRICS COMPONENT
// ==========================================

interface AccountsMetricsProps {
  totalAccounts: number
  totalMiles: number
  averageMilesPerClient: number
}

export function AccountsMetrics({ 
  totalAccounts, 
  totalMiles, 
  averageMilesPerClient 
}: AccountsMetricsProps) {
  const metrics = [
    {
      title: "Total de Contas",
      value: totalAccounts.toLocaleString('pt-BR'),
      icon: "📊",
      description: "Contas ativas de milhas",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "Total de Milhas", 
      value: totalMiles.toLocaleString('pt-BR'),
      icon: "✈️",
      description: "Saldo consolidado",
      color: "bg-green-50 text-green-600 border-green-200"
    },
    {
      title: "Média por Cliente",
      value: averageMilesPerClient.toLocaleString('pt-BR'),
      icon: "📈", 
      description: "Milhas por cliente",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    }
  ]

  return (
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
          {metrics.map((metric) => (
            <div 
              key={metric.title}
              className={`rounded-lg border p-4 ${metric.color} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-70 uppercase tracking-wide">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {metric.value}
                  </p>
                  <p className="text-xs opacity-60 mt-1">
                    {metric.description}
                  </p>
                </div>
                <div className="text-2xl opacity-70">
                  {metric.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}