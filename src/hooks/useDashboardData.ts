// ==========================================
// FLYMILHAS - HOOK DASHBOARD DATA
// ==========================================

import { useState, useEffect, useCallback } from 'react'
import type { 
  AccountMetrics, 
  CompanyDistribution, 
  TopClient,
  ApiResponse 
} from '@/types/dashboard'

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

      // Fazer todas as chamadas em paralelo
      const [metricsRes, distributionRes, clientsRes] = await Promise.all([
        fetch('/api/dashboard/metrics'),
        fetch('/api/dashboard/company-distribution'),
        fetch('/api/dashboard/top-clients')
      ])

      // Verificar se todas as responses são ok
      if (!metricsRes.ok || !distributionRes.ok || !clientsRes.ok) {
        throw new Error('Erro ao buscar dados do dashboard')
      }

      // Parse das responses
      const [metricsData, distributionData, clientsData] = await Promise.all([
        metricsRes.json() as Promise<ApiResponse<AccountMetrics>>,
        distributionRes.json() as Promise<ApiResponse<CompanyDistribution[]>>,
        clientsRes.json() as Promise<ApiResponse<TopClient[]>>
      ])

      // Verificar erros nas APIs
      if (metricsData.error) {
        throw new Error(metricsData.error)
      }
      if (distributionData.error) {
        throw new Error(distributionData.error)
      }
      if (clientsData.error) {
        throw new Error(clientsData.error)
      }

      // Atualizar estados
      setMetrics(metricsData.data)
      setCompanyDistribution(distributionData.data || [])
      setTopClients(clientsData.data || [])

    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar dados na montagem do componente
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

// Hook para métricas individuais (caso precise usar separadamente)
export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<AccountMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard/metrics')
      if (!response.ok) {
        throw new Error('Erro ao buscar métricas')
      }

      const data = await response.json() as ApiResponse<AccountMetrics>
      if (data.error) {
        throw new Error(data.error)
      }

      setMetrics(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return { metrics, loading, error, refetch: fetchMetrics }
}