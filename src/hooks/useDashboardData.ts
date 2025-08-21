'use client'

import { useState, useEffect, useCallback } from 'react'

interface AccountMetrics {
  totalAccounts: number
  totalMiles: number
  totalClients: number
  averageMilesPerClient: number
}

interface CompanyDistribution {
  company: string
  balance: number
  percentage: number
  accountCount: number
  color: string
}

interface TopClient {
  id: string
  name: string
  email: string
  totalMiles: number
  accountCount: number
}

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

interface UseDashboardDataReturn {
  metrics: AccountMetrics | null
  companyDistribution: CompanyDistribution[]
  topClients: TopClient[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboardData(): UseDashboardDataReturn {
  const [metrics, setMetrics] = useState<AccountMetrics | null>(null)
  const [companyDistribution, setCompanyDistribution] = useState<CompanyDistribution[]>([])
  const [topClients, setTopClients] = useState<TopClient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [metricsRes, distributionRes, clientsRes] = await Promise.all([
        fetch('/api/dashboard/metrics'),
        fetch('/api/dashboard/company-distribution'),
        fetch('/api/dashboard/top-clients')
      ])

      if (!metricsRes.ok || !distributionRes.ok || !clientsRes.ok) {
        throw new Error('Erro ao buscar dados das APIs')
      }

      const [metricsData, distributionData, clientsData] = await Promise.all([
        metricsRes.json() as Promise<ApiResponse<AccountMetrics>>,
        distributionRes.json() as Promise<ApiResponse<CompanyDistribution[]>>,
        clientsRes.json() as Promise<ApiResponse<TopClient[]>>
      ])

      if (metricsData.error || distributionData.error || clientsData.error) {
        throw new Error('Erro nos dados retornados pelas APIs')
      }

      setMetrics(metricsData.data)
      setCompanyDistribution(distributionData.data || [])
      setTopClients(clientsData.data || [])

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    metrics,
    companyDistribution,
    topClients,
    loading,
    error,
    refetch: fetchDashboardData
  }
}