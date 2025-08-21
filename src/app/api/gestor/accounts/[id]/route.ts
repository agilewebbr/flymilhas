import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { updateAccountSchema } from '@/lib/validations/account'
import { z } from 'zod'

// GET /api/gestor/accounts/[id] - Detalhes da conta
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = params.id
    
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

    // Buscar conta com informações do cliente
    const { data: account, error } = await supabase
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
        clients!inner(
          id,
          name,
          email,
          gestor_id
        )
      `)
      .eq('id', accountId)
      .eq('clients.gestor_id', user.id)
      .single()

    if (error || !account) {
      return NextResponse.json({ 
        data: null, 
        error: 'Conta não encontrada' 
      }, { status: 404 })
    }

    // Buscar estatísticas das transações
    const { data: transactionStats } = await supabase
      .from('transactions')
      .select('type, points')
      .eq('account_id', accountId)

    // Calcular estatísticas
    const totalAcumulos = transactionStats
      ?.filter(t => t.type === 'acumulo')
      .reduce((sum, t) => sum + t.points, 0) || 0

    const totalResgates = transactionStats
      ?.filter(t => t.type === 'resgate')
      .reduce((sum, t) => sum + t.points, 0) || 0

    const totalTransactions = transactionStats?.length || 0

    return NextResponse.json({
      data: {
        account,
        stats: {
          total_acumulos: totalAcumulos,
          total_resgates: totalResgates,
          total_transactions: totalTransactions,
          current_balance: account.current_balance
        }
      },
      error: null
    })

  } catch (error) {
    console.error('Erro ao buscar conta:', error)
    return NextResponse.json({ 
      data: null, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// PUT /api/gestor/accounts/[id] - Atualizar conta
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = params.id
    const body = await request.json()
    
    // Validar dados de entrada
    const validatedData = updateAccountSchema.parse(body)
    
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
        client_id,
        clients!inner(gestor_id)
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

    // Se mudando programa, verificar se já existe conta para o novo programa
    if (validatedData.program_name) {
      const { data: existingAccount } = await supabase
        .from('accounts')
        .select('id')
        .eq('client_id', account.client_id)
        .eq('program_name', validatedData.program_name)
        .neq('id', accountId)
        .single()

      if (existingAccount) {
        return NextResponse.json({
          data: null,
          error: `Cliente já possui conta no programa ${validatedData.program_name}`
        }, { status: 409 })
      }
    }

    // Atualizar conta
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (validatedData.program_name) updateData.program_name = validatedData.program_name
    if (validatedData.account_number !== undefined) updateData.account_number = validatedData.account_number || null
    if (validatedData.currency) updateData.currency = validatedData.currency

    const { data: updatedAccount, error: updateError } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('id', accountId)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao atualizar conta:', updateError)
      return NextResponse.json({ 
        data: null, 
        error: 'Erro ao atualizar conta' 
      }, { status: 500 })
    }

    return NextResponse.json({
      data: updatedAccount,
      error: null
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        data: null,
        error: 'Dados inválidos',
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Erro na atualização de conta:', error)
    return NextResponse.json({ 
      data: null, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// DELETE /api/gestor/accounts/[id] - Remover conta
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = params.id
    
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

    // Verificar se há saldo na conta
    if (account.current_balance > 0) {
      return NextResponse.json({
        data: null,
        error: `Não é possível remover conta com saldo positivo (${account.current_balance} pontos)`
      }, { status: 409 })
    }

    // Remover conta (cascade vai remover transações)
    const { error: deleteError } = await supabase
      .from('accounts')
      .delete()
      .eq('id', accountId)

    if (deleteError) {
      console.error('Erro ao remover conta:', deleteError)
      return NextResponse.json({ 
        data: null, 
        error: 'Erro ao remover conta' 
      }, { status: 500 })
    }

    return NextResponse.json({
      data: { 
        message: `Conta ${account.program_name} removida com sucesso`,
        removed_account: {
          id: accountId,
          program_name: account.program_name,
          client_name: account.clients.name
        }
      },
      error: null
    })

  } catch (error) {
    console.error('Erro na remoção de conta:', error)
    return NextResponse.json({ 
      data: null, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}