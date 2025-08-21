// ==========================================
// FLYMILHAS - API DASHBOARD METRICS
// ==========================================

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { AccountMetrics, ApiResponse } from '@/types/dashboard'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { data: null, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Query para métricas consolidadas
    const { data: metricsData, error: metricsError } = await supabase
      .rpc('get_dashboard_metrics', { gestor_user_id: user.id })

    if (metricsError) {
      console.error('Erro ao buscar métricas:', metricsError)
      
      // Fallback: buscar dados básicos separadamente
      const [clientsResult, accountsResult] = await Promise.all([
        supabase
          .from('clients')
          .select('id')
          .eq('gestor_id', user.id),
        supabase
          .from('accounts')
          .select('current_balance, client_id')
          .in('client_id', 
            supabase
              .from('clients')
              .select('id')
              .eq('gestor_id', user.id)
          )
      ])

      if (clientsResult.error || accountsResult.error) {
        throw new Error('Erro ao buscar dados básicos')
      }

      const totalClients = clientsResult.data?.length || 0
      const totalAccounts = accountsResult.data?.length || 0
      const totalMiles = accountsResult.data?.reduce((sum, acc) => sum + (acc.current_balance || 0), 0) || 0
      const averageMilesPerClient = totalClients > 0 ? Math.round(totalMiles / totalClients) : 0

      const metrics: AccountMetrics = {
        totalAccounts,
        totalMiles,
        totalClients,
        averageMilesPerClient
      }

      return NextResponse.json({ data: metrics, error: null })
    }

    // Se a RPC funcionou, usar os dados dela
    const metrics: AccountMetrics = {
      totalAccounts: metricsData?.[0]?.total_accounts || 0,
      totalMiles: metricsData?.[0]?.total_miles || 0,
      totalClients: metricsData?.[0]?.total_clients || 0,
      averageMilesPerClient: metricsData?.[0]?.average_miles_per_client || 0
    }

    return NextResponse.json({ data: metrics, error: null })

  } catch (error) {
    console.error('Erro na API de métricas:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}