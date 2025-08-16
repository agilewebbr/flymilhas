import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createClientSchema, clientQuerySchema } from '@/lib/validations/client'
import z from 'zod'

// GET /api/gestor/clients - Listar clientes do gestor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = clientQuerySchema.parse(Object.fromEntries(searchParams))
    
    // Verificar se usuário está autenticado
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 })
    }

    // Extrair token do header
    const token = authHeader.replace('Bearer ', '')
    
    // Configurar Supabase com o token do usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Buscar clientes do gestor com paginação e filtros
    let queryBuilder = supabase
      .from('clients')
      .select('*, accounts(count)', { count: 'exact' })
      .eq('gestor_id', user.id)

    // Aplicar filtro de busca
    if (query.search) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query.search}%,email.ilike.%${query.search}%`)
    }

    // Aplicar ordenação
    queryBuilder = queryBuilder.order(query.sortBy, { ascending: query.sortOrder === 'asc' })

    // Aplicar paginação
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const from = (page - 1) * limit
    const to = from + limit - 1

    queryBuilder = queryBuilder.range(from, to)

    const { data: clients, error, count } = await queryBuilder

    if (error) {
      console.error('Erro ao buscar clientes:', error)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    return NextResponse.json({
      clients: clients || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Erro na API de clientes:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST /api/gestor/clients - Criar novo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createClientSchema.parse(body)
    
    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Verificar se é gestor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profile?.role !== 'gestor') {
      return NextResponse.json({ error: 'Acesso negado. Apenas gestores podem criar clientes.' }, { status: 403 })
    }

    // Criar cliente
    const { data: newClient, error: createError } = await supabase
      .from('clients')
      .insert({
        gestor_id: user.id,
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        notes: validatedData.notes || null
      })
      .select()
      .single()

    if (createError) {
      console.error('Erro ao criar cliente:', createError)
      return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
    }

    return NextResponse.json(newClient, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Erro na criação de cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}