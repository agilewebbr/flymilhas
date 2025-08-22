// src/app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  console.log('🔍 API /clients GET chamada')
  try {
    const cookieStore = cookies()
    console.log('🔍 Cookies disponíveis:', cookieStore.getAll().map(c => c.name))
    
    const supabase = createRouteHandlerClient({ cookies })
    console.log('🔍 Supabase client criado')

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('🔍 Auth result:', { user: user?.id, error: authError?.message })

    if (authError || !user) {
      console.log('🔍 Retornando 401 - authError:', authError, 'user:', !!user)
      return NextResponse.json(
        { data: null, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
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
      console.error('🔍 Erro na query:', fetchError)
      return NextResponse.json(
        { data: null, error: 'Erro ao buscar clientes' },
        { status: 500 }
      )
    }

    console.log('🔍 Query sucesso - clients:', clients?.length, 'count:', count)

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      data: {
        clients: clients || [],
        pagination: {
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
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
    const supabase = createRouteHandlerClient({ cookies })
    
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