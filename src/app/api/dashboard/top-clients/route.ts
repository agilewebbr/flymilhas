import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const topClients = [
      {
        id: '1',
        name: 'Ana Costa',
        email: 'ana.costa@email.com',
        totalMiles: 229000,
        accountCount: 2
      },
      {
        id: '2', 
        name: 'Carlos Ferreira',
        email: 'carlos.ferreira@email.com',
        totalMiles: 174000,
        accountCount: 3
      },
      {
        id: '3',
        name: 'Maria Santos',
        email: 'maria.santos@email.com', 
        totalMiles: 162000,
        accountCount: 2
      },
      {
        id: '4',
        name: 'João Silva', 
        email: 'joao.silva@email.com',
        totalMiles: 127000,
        accountCount: 2
      },
      {
        id: '5',
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        totalMiles: 28000,
        accountCount: 1
      }
    ]

    return NextResponse.json({ 
      data: topClients, 
      error: null 
    })
  } catch (error) {
    console.error('Erro na API top clientes:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}