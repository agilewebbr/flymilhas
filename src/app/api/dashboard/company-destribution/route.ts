// ==========================================
// FLYMILHAS - API COMPANY DISTRIBUTION
// ==========================================

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { CompanyDistribution, ApiResponse } from '@/types/dashboard'

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

    // Buscar distribuição por programa de milhas
    const { data: accountsData, error: accountsError } = await supabase
      .from('accounts')
      .select(`
        program_name,
        current_balance,
        client_id,
        clients!inner(gestor_id)
      `)
      .eq('clients.gestor_id', user.id)

    if (accountsError) {
      console.error('Erro ao buscar distribuição:', accountsError)
      return NextResponse.json(
        { data: null, error: 'Erro ao buscar dados de distribuição' },
        { status: 500 }
      )
    }

    // Agrupar dados por programa
    const groupedData = accountsData.reduce((acc, account) => {
      const company = account.program_name || 'Outros'
      
      if (!acc[company]) {
        acc[company] = {
          balance: 0,
          accountCount: 0
        }
      }
      
      acc[company].balance += account.current_balance || 0
      acc[company].accountCount += 1
      
      return acc
    }, {} as Record<string, { balance: number, accountCount: number }>)

    // Calcular total para percentuais
    const totalBalance = Object.values(groupedData).reduce((sum, item) => sum + item.balance, 0)

    // Cores para cada companhia
    const companyColors: Record<string, string> = {
      'LATAM Pass': '#8B5CF6',
      'Smiles (GOL)': '#F59E0B', 
      'TudoAzul': '#3B82F6',
      'Azul': '#3B82F6',
      'TAM': '#8B5CF6',
      'GOL': '#F59E0B',
      'Outros': '#6B7280'
    }

    // Transformar em array final
    const distribution: CompanyDistribution[] = Object.entries(groupedData)
      .map(([company, data]) => ({
        company,
        balance: data.balance,
        percentage: totalBalance > 0 ? Math.round((data.balance / totalBalance) * 100) : 0,
        accountCount: data.accountCount,
        color: companyColors[company] || companyColors['Outros']
      }))
      .sort((a, b) => b.balance - a.balance) // Ordenar por saldo decrescente

    return NextResponse.json({ data: distribution, error: null })

  } catch (error) {
    console.error('Erro na API de distribuição:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}