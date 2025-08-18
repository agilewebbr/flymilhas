// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface DashboardStats {
  totalClients: number
  newClientsThisMonth: number
  growthPercentage: number
  clientsPerMonth: Array<{ month: string; count: number }>
  recentClients: Array<{
    id: string
    name: string
    email: string
    created_at: string
  }>
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // 1. Total de clientes
      const { count: totalClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

      // 2. Clientes deste mês
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: newClientsThisMonth } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString())

      // 3. Clientes do mês anterior (para calcular crescimento)
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      
      const { count: lastMonthClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', startOfMonth.toISOString())

      // 4. Dados para gráfico (últimos 6 meses)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const { data: monthlyData } = await supabase
        .from('clients')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString())
        .order('created_at', { ascending: true })

      // 5. Últimos 5 clientes
      const { data: recentClients } = await supabase
        .from('clients')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      // Processar dados do gráfico
      const clientsPerMonth = []
      if (monthlyData) {
        const monthCounts = monthlyData.reduce((acc, client) => {
          const month = new Date(client.created_at).toLocaleDateString('pt-BR', { 
            year: 'numeric', 
            month: 'short' 
          })
          acc[month] = (acc[month] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        clientsPerMonth = Object.entries(monthCounts).map(([month, count]) => ({
          month,
          count
        }))
      }

      // Calcular crescimento
      const growthPercentage = lastMonthClients > 0 
        ? ((newClientsThisMonth - lastMonthClients) / lastMonthClients) * 100 
        : 0

      setStats({
        totalClients: totalClients || 0,
        newClientsThisMonth: newClientsThisMonth || 0,
        growthPercentage,
        clientsPerMonth,
        recentClients: recentClients || []
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  return { stats, loading, error, refetch: fetchDashboardStats }
}