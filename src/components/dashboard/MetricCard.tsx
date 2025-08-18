// src/components/dashboard/MetricCard.tsx
interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  bgColor?: string
  textColor?: string
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  bgColor = "bg-blue-100", 
  textColor = "text-blue-600" 
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm font-medium mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}%
            </p>
          )}
        </div>
        <div className={`h-12 w-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <div className={`h-6 w-6 ${textColor}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}