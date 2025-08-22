// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { transactionSchema, transactionFiltersSchema } from '@/lib/validations/transaction'

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
    
    // Validar filtros
    const filters = {
      account_id: searchParams.get('account_id') || undefined,
      type: searchParams.get('type') || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      min_points: searchParams.get('min_points') ? Number(searchParams.get('min_points')) : undefined,
      max_points: searchParams.get('max_points') ? Number(searchParams.get('max_points')) : undefined,
      search: searchParams.get('search') || undefined,
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Construir query
    let query = supabase
      .from('transactions')
      .select(`
        *,
        account:accounts(
          id,
          program_name,
          account_number,
          current_balance,
          client:clients(
            name
          )
        )
      `)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (filters.account_id) {
      query = query.eq('account_id', filters.account_id)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.date_from) {
      query = query.gte('date', filters.date_from)
    }
    if (filters.date_to) {
      query = query.lte('date', filters.date_to)
    }
    if (filters.min_points) {
      query = query.gte('points', filters.min_points)
    }
    if (filters.max_points) {
      query = query.lte('points', filters.max_points)
    }
    if (filters.search) {
      query = query.ilike('description', `%${filters.search}%`)
    }

    // Executar query com paginação
    const { data: transactions, error: fetchError, count } = await query
      .range(offset, offset + limit - 1)

    if (fetchError) {
      console.error('Erro ao buscar transações:', fetchError)
      return NextResponse.json(
        { data: null, error: 'Erro ao buscar transações' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: {
        transactions: transactions || [],
        totalCount: count || 0,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit)
      },
      error: null
    })

  } catch (error) {
    console.error('Erro na API de transações:', error)
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
    
    // Validar dados
    const validatedData = transactionSchema.parse(body)

    // Verificar se a conta pertence ao usuário (via RLS isso já é garantido, mas vamos verificar explicitamente)
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id, current_balance, client:clients!inner(gestor_id)')
      .eq('id', validatedData.account_id)
      .single()

    if (accountError || !account) {
      return NextResponse.json(
        { data: null, error: 'Conta não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o usuário é o gestor da conta
    if ((account.client as any)?.gestor_id !== user.id) {
      return NextResponse.json(
        { data: null, error: 'Você não tem permissão para esta conta' },
        { status: 403 }
      )
    }

    // Verificar se não é resgate maior que saldo atual
    if (validatedData.type === 'debit' && validatedData.points > account.current_balance) {
      return NextResponse.json(
        { data: null, error: 'Saldo insuficiente para resgate' },
        { status: 400 }
      )
    }

    // Usar transação SQL para consistência
    const { data: transaction, error: insertError } = await supabase.rpc('create_transaction_with_balance_update', {
      p_account_id: validatedData.account_id,
      p_type: validatedData.type,
      p_points: validatedData.points,
      p_description: validatedData.description || null,
      p_date: validatedData.date
    })

    if (insertError) {
      console.error('Erro ao criar transação:', insertError)
      return NextResponse.json(
        { data: null, error: 'Erro ao criar transação' },
        { status: 500 }
      )
    }

    // Buscar transação criada com relacionamentos
    const { data: newTransaction, error: fetchError } = await supabase
      .from('transactions')
      .select(`
        *,
        account:accounts(
          id,
          program_name,
          account_number,
          current_balance,
          client:clients(
            name
          )
        )
      `)
      .eq('id', transaction.id)
      .single()

    if (fetchError) {
      console.error('Erro ao buscar transação criada:', fetchError)
      return NextResponse.json(
        { data: null, error: 'Transação criada mas erro ao buscar dados' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: newTransaction,
      error: null
    })

  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { data: null, error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    console.error('Erro ao criar transação:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}