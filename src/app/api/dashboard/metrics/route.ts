import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const metrics = {
      totalAccounts: 10,
      totalMiles: 715000,
      totalClients: 5, 
      averageMilesPerClient: 143000
    }

    return NextResponse.json({ 
      data: metrics, 
      error: null 
    })
  } catch (error) {
    console.error('Erro na API de métricas:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}