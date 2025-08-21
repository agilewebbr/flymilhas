import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createAccountSchema, accountQuerySchema } from '@/lib/validations/account'
import { z } from 'zod'

// GET /api/gestor/clients/[id]/accounts - Listar contas do cliente
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id
    const { searchParams } = new URL(request.url)
    const query = accountQuerySchema.parse(Object.fromEntries(searchParams))
    
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

    // Verificar se o cliente pertence ao gestor
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, gestor_id, name')
      .eq('id', clientId)
      .eq('gestor_id', user.id)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    // Buscar contas do cliente
    let queryBuilder = supabase
      .from('accounts')
      .select(`
        id,
        client_id,
        program_name,
        account_number,
        current_balance,
        currency,
        created_at,
        updated_at,
        transactions!inner(count)
      `, { count: 'exact' })
      .eq('client_id', clientId)

    // Aplicar filtros
    if (query.program_name) {
      queryBuilder = queryBuilder.eq('program_name', query.program_name)
    }

    // Aplicar paginação
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const from = (page - 1) * limit
    const to = from + limit - 1

    queryBuilder = queryBuilder.range(from, to)

    const { data: accounts, error, count } = await queryBuilder

    if (error) {
      console.error('Erro ao buscar contas:', error)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    // Calcular total de pontos/milhas
    const totalBalance = accounts?.reduce((sum, account) => sum + account.current_balance, 0) || 0

    return NextResponse.json({
      data: {
        client: {
          id: client.id,
          name: client.name
        },
        accounts: accounts || [],
        summary: {
          total_accounts: count || 0,
          total_balance: totalBalance
        },
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      },
      error: null
    })

  } catch (error) {
    console.error('Erro na API de contas do cliente:', error)
    return NextResponse.json({ 
      data: null, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// POST /api/gestor/clients/[id]/accounts - Criar nova conta para o cliente
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id
    const body = await request.json()
    
    // Validar dados de entrada
    const validatedData = createAccountSchema.parse({
      ...body,
      client_id: clientId
    })
    
    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ 
        data: null, 
        error: 'Token de autorização necessário' 
      }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ 
        data: null, 
        error: 'Token inválido' 
      }, { status: 401 })
    }

    // Verificar se o cliente pertence ao gestor
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, gestor_id')
      .eq('id', clientId)
      .eq('gestor_id', user.id)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ 
        data: null, 
        error: 'Cliente não encontrado' 
      }, { status: 404 })
    }

    // Verificar se já existe conta para este programa
    const { data: existingAccount } = await supabase
      .from('accounts')
      .select('id')
      .eq('client_id', clientId)
      .eq('program_name', validatedData.program_name)
      .single()

    if (existingAccount) {
      return NextResponse.json({
        data: null,
        error: `Cliente já possui conta no programa ${validatedData.program_name}`
      }, { status: 409 })
    }

    // Criar conta
    const { data: newAccount, error: createError } = await supabase
      .from('accounts')
      .insert({
        client_id: clientId,
        program_name: validatedData.program_name,
        account_number: validatedData.account_number || null,
        currency: validatedData.currency,
        current_balance: 0
      })
      .select()
      .single()

    if (createError) {
      console.error('Erro ao criar conta:', createError)
      return NextResponse.json({ 
        data: null, 
        error: 'Erro ao criar conta' 
      }, { status: 500 })
    }

    return NextResponse.json({
      data: newAccount,
      error: null
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        data: null,
        error: 'Dados inválidos',
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Erro na criação de conta:', error)
    return NextResponse.json({ 
      data: null, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}