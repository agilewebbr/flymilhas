import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const distribution = [
      {
        company: 'LATAM Pass',
        balance: 397000,
        percentage: 56,
        accountCount: 4,
        color: '#8B5CF6'
      },
      {
        company: 'TudoAzul',
        balance: 202000,
        percentage: 28,
        accountCount: 3,
        color: '#3B82F6'
      },
      {
        company: 'Smiles (GOL)',
        balance: 116000,
        percentage: 16,
        accountCount: 3,
        color: '#F59E0B'
      }
    ]

    return NextResponse.json({ 
      data: distribution, 
      error: null 
    })
  } catch (error) {
    console.error('Erro na API de distribuição:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}