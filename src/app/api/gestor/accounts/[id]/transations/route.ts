import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createTransactionSchema, transactionQuerySchema } from '@/lib/validations/account'
import { z } from 'zod'

// GET /api/gestor/accounts/[id]/transactions - Listar transações da conta
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = params.id
    const { searchParams } = new URL(request.url)
    const query = transactionQuerySchema.parse(Object.fromEntries(searchParams))
    
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

    // Verificar se a conta pertence ao gestor
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select(`
        id,
        program_name,
        current_balance,
        clients!inner(
          id,
          name,
          gestor_id
        )
      `)
      .eq('id', accountId)
      .eq('clients.gestor_id', user.id)
      .single()

    if (accountError || !account) {
      return NextResponse.json({ 
        data: null, 
        error: 'Conta não encontrada' 
      }, { status: 404 })
    }

    // Buscar transações com filtros
    let queryBuilder = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('account_id', accountId)

    // Aplicar filtros
    if (query.type) {
      queryBuilder = queryBuilder.eq('type', query.type)
    }

    if (query.start_date) {
      queryBuilder = queryBuilder.gte('date', query.start_date)
    }

    if (query.end_date) {
      queryBuilder = queryBuilder.lte('date', query.end_date)
    }

    // Aplicar ordenação
    queryBuilder = queryBuilder.order(query.sortBy, { 
      ascending: query.sortOrder === 'asc' 
    })

    // Aplicar paginação
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const from = (page - 1) * limit
    const to = from + limit - 1

    queryBuilder = queryBuilder.range(from, to)

    const { data: transactions, error, count } = await queryBuilder

    if (error) {
      console.error('Erro ao buscar transações:', error)
      return NextResponse.json({ 
        data: null, 
        error: 'Erro interno do servidor' 
      }, { status: 500 })
    }

    // Calcular resumo das transações
    const totalAcumulos = transactions
      ?.filter(t => t.type === 'acumulo')
      .reduce((sum, t) => sum + t.points, 0) || 0

    const totalResgates = transactions
      ?.filter(t => t.type === 'resgate')
      .reduce((sum, t) => sum + t.points, 0) || 0

    return NextResponse.json({
      data: {
        account: {
          id: account.id,
          program_name: account.program_name,
          current_balance: account.current_balance,
          client: {
            id: account.clients.id,
            name: account.clients.name
          }
        },
        transactions: transactions || [],
        summary: {
          total_transactions: count || 0,
          total_acumulos: totalAcumulos,
          total_resgates: totalResgates,
          balance_from_transactions: totalAcumulos - totalResgates
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
    console.error('Erro na API de transações:', error)
    return NextResponse.json({ 
      data: null, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// POST /api/gestor/accounts/[id]/transactions - Criar nova transação
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = params.id
    const body = await request.json()
    
    // Validar dados de entrada
    const validatedData = createTransactionSchema.parse({
      ...body,
      account_id: accountId
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

    // Verificar se a conta pertence ao gestor
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select(`
        id,
        current_balance,
        program_name,
        clients!inner(gestor_id, name)
      `)
      .eq('id', accountId)
      .eq('clients.gestor_id', user.id)
      .single()

    if (accountError || !account) {
      return NextResponse.json({ 
        data: null, 
        error: 'Conta não encontrada' 
      }, { status: 404 })
    }

    // Verificar se há saldo suficiente para resgate
    if (validatedData.type === 'resgate' && account.current_balance < validatedData.points) {
      return NextResponse.json({
        data: null,
        error: `Saldo insuficiente. Disponível: ${account.current_balance} pontos, Solicitado: ${validatedData.points} pontos`
      }, { status: 409 })
    }

    // Criar transação
    const { data: newTransaction, error: createError } = await supabase
      .from('transactions')
      .insert({
        account_id: accountId,
        type: validatedData.type,
        points: validatedData.points,
        date: validatedData.date,
        description: validatedData.description || null
      })
      .select()
      .single()

    if (createError) {
      console.error('Erro ao criar transação:', createError)
      return NextResponse.json({ 
        data: null, 
        error: 'Erro ao criar transação' 
      }, { status: 500 })
    }

    // Buscar saldo atualizado da conta
    const { data: updatedAccount } = await supabase
      .from('accounts')
      .select('current_balance')
      .eq('id', accountId)
      .single()

    return NextResponse.json({
      data: {
        transaction: newTransaction,
        account_balance: updatedAccount?.current_balance || 0,
        operation_summary: {
          type: validatedData.type,
          points: validatedData.points,
          previous_balance: account.current_balance,
          new_balance: updatedAccount?.current_balance || 0
        }
      },
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

    console.error('Erro na criação de transação:', error)
    return NextResponse.json({ 
      data: null, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}