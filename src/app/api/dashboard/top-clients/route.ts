// ==========================================
// FLYMILHAS - API TOP CLIENTS
// ==========================================

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { TopClient, ApiResponse } from '@/types/dashboard'

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

    // Buscar clientes com suas contas e saldos
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select(`
        id,
        name,
        email,
        accounts(
          id,
          current_balance
        )
      `)
      .eq('gestor_id', user.id)

    if (clientsError) {
      console.error('Erro ao buscar top clientes:', clientsError)
      return NextResponse.json(
        { data: null, error: 'Erro ao buscar dados dos clientes' },
        { status: 500 }
      )
    }

    // Processar dados para calcular totais
    const topClients: TopClient[] = clientsData
      .map(client => {
        const accounts = client.accounts || []
        const totalMiles = accounts.reduce((sum, account) => sum + (account.current_balance || 0), 0)
        const accountCount = accounts.length

        return {
          id: client.id,
          name: client.name,
          email: client.email || '',
          totalMiles,
          accountCount
        }
      })
      .filter(client => client.totalMiles > 0) // Só clientes com milhas
      .sort((a, b) => b.totalMiles - a.totalMiles) // Ordenar por maior saldo
      .slice(0, 10) // Top 10

    return NextResponse.json({ data: topClients, error: null })

  } catch (error) {
    console.error('Erro na API top clientes:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}