// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface DashboardStats {
  // Dados de clientes existentes (manter)
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
  
  // NOVOS: Dados de contas de milhas
  accountsData: {
    totalAccounts: number
    totalBalance: number
    accountsByProgram: Array<{
      program_name: string
      account_count: number
      total_balance: number
    }>
    recentTransactions: Array<{
      id: string
      type: 'acumulo' | 'resgate'
      points: number
      date: string
      client_name: string
      program_name: string
    }>
    balanceEvolution: Array<{
      date: string
      total_balance: number
    }>
  }
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // 1. DADOS EXISTENTES DE CLIENTES (manter igual)
      const { count: totalClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: newClientsThisMonth } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString())

      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      
      const { count: lastMonthClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', startOfMonth.toISOString())

      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const { data: monthlyData } = await supabase
        .from('clients')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString())
        .order('created_at', { ascending: true })

      const { data: recentClients } = await supabase
        .from('clients')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      // 2. NOVOS DADOS DE CONTAS DE MILHAS
      
      // Total de contas
      const { count: totalAccounts } = await supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true })

      // Saldo total
      const { data: balanceData } = await supabase
        .from('accounts')
        .select('current_balance')

      const totalBalance = balanceData?.reduce((sum, account) => sum + account.current_balance, 0) || 0

      // Contas por programa
      const { data: programData } = await supabase
        .from('accounts')
        .select('program_name, current_balance')

      const accountsByProgram = programData?.reduce((acc, account) => {
        const existing = acc.find(item => item.program_name === account.program_name)
        if (existing) {
          existing.account_count += 1
          existing.total_balance += account.current_balance
        } else {
          acc.push({
            program_name: account.program_name,
            account_count: 1,
            total_balance: account.current_balance
          })
        }
        return acc
      }, [] as Array<{ program_name: string; account_count: number; total_balance: number }>) || []

      // Transações recentes (últimas 10)
      const { data: recentTransactionsData } = await supabase
        .from('transactions')
        .select(`
          id,
          type,
          points,
          date,
          accounts!inner(
            program_name,
            clients!inner(name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      const recentTransactions = recentTransactionsData?.map(t => ({
        id: t.id,
        type: t.type as 'acumulo' | 'resgate',
        points: t.points,
        date: t.date,
        // CORREÇÃO DA LINHA 144: remover [0] pois não é array
        client_name: (t.accounts as any).clients?.name || 'Cliente',
        program_name: (t.accounts as any).program_name
      })) || []

      // Evolução de saldo (últimos 30 dias - simplificado)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: evolutionData } = await supabase
        .from('transactions')
        .select('date, type, points')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true })

      // Calcular evolução simplificada (saldo atual como ponto final)
      const balanceEvolution = [
        {
          date: new Date().toISOString().split('T')[0],
          total_balance: totalBalance
        }
      ]

      // Processar dados do gráfico de clientes (manter igual)
      let clientsPerMonth: Array<{ month: string; count: number }> = []
      
      if (monthlyData && monthlyData.length > 0) {
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

      // Calcular crescimento (manter igual)
      const growthPercentage = lastMonthClients && lastMonthClients > 0 
        ? ((newClientsThisMonth || 0) - lastMonthClients) / lastMonthClients * 100 
        : 0

      setStats({
        // Dados existentes
        totalClients: totalClients || 0,
        newClientsThisMonth: newClientsThisMonth || 0,
        growthPercentage,
        clientsPerMonth,
        recentClients: recentClients || [],
        
        // NOVOS dados de contas
        accountsData: {
          totalAccounts: totalAccounts || 0,
          totalBalance,
          accountsByProgram,
          recentTransactions,
          balanceEvolution
        }
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