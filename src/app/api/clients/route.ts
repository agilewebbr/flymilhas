// src/app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { data: null, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Construir query base
    let query = supabase
      .from('clients')
      .select(`
        *,
        accounts:accounts(
          id,
          program_name,
          current_balance
        )
      `, { count: 'exact' })
      .eq('gestor_id', user.id)
      .order('created_at', { ascending: false })

    // Aplicar filtro de busca se fornecido
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Aplicar paginação
    const { data: clients, error: fetchError, count } = await query
      .range(offset, offset + limit - 1)

    if (fetchError) {
      console.error('Erro ao buscar clientes:', fetchError)
      return NextResponse.json(
        { data: null, error: 'Erro ao buscar clientes' },
        { status: 500 }
      )
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      data: {
        clients: clients || [],
        pagination: {
          page,
          limit,
          totalPages,
          totalCount: count || 0
        }
      },
      error: null
    })

  } catch (error) {
    console.error('Erro na API de clientes:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { data: null, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validação básica
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json(
        { data: null, error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    // Preparar dados para inserção
    const clientData = {
      gestor_id: user.id,
      name: body.name.trim(),
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      notes: body.notes?.trim() || null
    }

    // Inserir cliente
    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert(clientData)
      .select('*')
      .single()

    if (insertError) {
      console.error('Erro ao criar cliente:', insertError)
      return NextResponse.json(
        { data: null, error: 'Erro ao criar cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: newClient,
      error: null
    })

  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}