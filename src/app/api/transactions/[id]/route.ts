// src/app/api/transactions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { transactionSchema } from '@/lib/validations/transaction'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: transaction, error } = await supabase
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
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json(
        { data: null, error: 'Transação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: transaction,
      error: null
    })

  } catch (error) {
    console.error('Erro ao buscar transação:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = transactionSchema.parse(body)

    // Buscar transação atual
    const { data: currentTransaction, error: fetchError } = await supabase
      .from('transactions')
      .select(`
        *,
        account:accounts(
          id,
          current_balance,
          client:clients!inner(gestor_id)
        )
      `)
      .eq('id', params.id)
      .single()

    if (fetchError || !currentTransaction) {
      return NextResponse.json(
        { data: null, error: 'Transação não encontrada' },
        { status: 404 }
      )
    }

    // Verificar permissão
    if ((currentTransaction.account?.client as any)?.gestor_id !== user.id) {
      return NextResponse.json(
        { data: null, error: 'Você não tem permissão para esta transação' },
        { status: 403 }
      )
    }

    // Usar função para atualizar com recálculo de saldo
    const { data: updatedTransaction, error: updateError } = await supabase.rpc('update_transaction_with_balance_recalc', {
      p_transaction_id: params.id,
      p_account_id: validatedData.account_id,
      p_type: validatedData.type,
      p_points: validatedData.points,
      p_description: validatedData.description || null,
      p_date: validatedData.date
    })

    if (updateError) {
      console.error('Erro ao atualizar transação:', updateError)
      return NextResponse.json(
        { data: null, error: 'Erro ao atualizar transação' },
        { status: 500 }
      )
    }

    // Buscar transação atualizada
    const { data: refreshedTransaction, error: refreshError } = await supabase
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
      .eq('id', params.id)
      .single()

    if (refreshError) {
      return NextResponse.json(
        { data: null, error: 'Erro ao buscar transação atualizada' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: refreshedTransaction,
      error: null
    })

  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { data: null, error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar transação:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Usar função para deletar com recálculo de saldo
    const { data, error: deleteError } = await supabase.rpc('delete_transaction_with_balance_recalc', {
      p_transaction_id: params.id,
      p_user_id: user.id
    })

    if (deleteError) {
      console.error('Erro ao deletar transação:', deleteError)
      return NextResponse.json(
        { data: null, error: 'Erro ao deletar transação' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: { success: true },
      error: null
    })

  } catch (error) {
    console.error('Erro ao deletar transação:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}