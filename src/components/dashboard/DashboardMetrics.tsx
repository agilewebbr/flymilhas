// src/components/dashboard/DashboardMetrics.tsx
import { MetricCard } from './MetricCard'

interface DashboardMetricsProps {
  totalClients: number
  newClientsThisMonth: number
  growthPercentage: number
}

export function DashboardMetrics({ 
  totalClients, 
  newClientsThisMonth, 
  growthPercentage 
}: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Total de Clientes"
        value={totalClients}
        icon={
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        }
        bgColor="bg-blue-100"
        textColor="text-blue-600"
      />
      
      <MetricCard
        title="Novos Este Mês"
        value={newClientsThisMonth}
        icon={
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        }
        bgColor="bg-green-100"
        textColor="text-green-600"
      />
      
      <MetricCard
        title="Crescimento"
        value={`${growthPercentage > 0 ? '+' : ''}${growthPercentage.toFixed(1)}%`}
        icon={
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={growthPercentage >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
          </svg>
        }
        bgColor={growthPercentage >= 0 ? "bg-green-100" : "bg-red-100"}
        textColor={growthPercentage >= 0 ? "text-green-600" : "text-red-600"}
      />
    </div>
  )
}