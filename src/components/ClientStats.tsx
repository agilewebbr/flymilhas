import { Client } from '@/lib/database.types'
import { CreditCard, TrendingUp, Calendar, Award, Plane, Clock } from 'lucide-react'

interface ClientStatsProps {
  client: Client
}

interface StatCard {
  title: string
  value: string | number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  iconColor: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

export default function ClientStats({ client }: ClientStatsProps) {
  // Dados mockados para Sprint 3 - substituir por dados reais depois
  const stats: StatCard[] = [
    {
      title: 'Contas de Milhas',
      value: 0,
      subtitle: 'Total de contas ativas',
      icon: CreditCard,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Total de Milhas',
      value: '0',
      subtitle: 'Em todas as contas',
      icon: Award,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Última Atividade',
      value: 'Nenhuma',
      subtitle: 'Movimentação recente',
      icon: TrendingUp,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Status',
      value: 'Ativo',
      subtitle: 'Cliente ativo no sistema',
      icon: Calendar,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 break-words">
                {typeof stat.value === 'number' ? stat.value.toLocaleString('pt-BR') : stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
              
              {/* Trend (se existir) */}
              {stat.trend && (
                <div className={`inline-flex items-center mt-2 text-xs ${
                  stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${
                    !stat.trend.isPositive ? 'rotate-180' : ''
                  }`} />
                  <span>{stat.trend.value}</span>
                </div>
              )}
            </div>
            
            {/* Ícone */}
            <div className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-4`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
      
      {/* Card especial para Sprint 3 */}
      <div className="sm:col-span-2 lg:col-span-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Métricas Avançadas em Desenvolvimento
          </h4>
          <p className="text-gray-600 mb-3">
            Histórico de transações, análises de pontuação e relatórios detalhados serão implementados no Sprint 3.
          </p>
          <div className="inline-flex items-center space-x-1 text-blue-600 text-sm font-medium">
            <Clock className="h-4 w-4" />
            <span>🚀 Em breve</span>
          </div>
        </div>
      </div>
    </div>
  )
}