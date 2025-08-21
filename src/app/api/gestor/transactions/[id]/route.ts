import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { updateTransactionSchema } from '@/lib/validations/account'
import { z } from 'zod'

// GET /api/gestor/transactions/[id] - Detalhes da transação
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transactionId = params.id
    
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

    // Buscar transação com informações da conta e cliente
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select(`
        id,
        account_id,
        type,
        points,
        date,
        description,
        created_at,
        accounts!inner(
          id,
          program_name,
          current_balance,
          clients!inner(
            id,
            name,
            gestor_id
          )
        )
      `)
      .eq('id', transactionId)
      .eq('accounts.clients.gestor_id', user.id)
      .single()

    if (error || !transaction) {
      return NextResponse.json({ 
        data: null, 
        error: 'Transação não encontrada' 
      }, { status: 404 })
    }

    return NextResponse.json({
      data: {
        transaction,
        account: {
          id: transaction.accounts.id,
          program_name: transaction.accounts.program_name,
          current_balance: transaction.accounts.current_balance
        },
        client: {
          id: transaction.accounts.clients.id,
          name: transaction.accounts.clients.name
        }
      },
      error: null
    })

  } catch (error) {
    console.error('Erro ao buscar transação:', error)
    return NextResponse.json({ 
      data: null, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// PUT /api/gestor/transactions/[id] - Atualizar transação
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transactionId = params.id
    const body = await request.json()
    
    // Validar dados de entrada
    const validatedData = updateTransactionSchema.parse(body)
    
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

    // Buscar transação atual
    const { data: currentTransaction, error: transactionError } = await supabase
      .from('transactions')
      .select(`
        id,
        account_id,
        type,
        points,
        date,
        description,
        accounts!inner(
          id,
          current_balance,
          clients!inner(gestor_id)
        )
      `)
      .eq('id', transactionId)
      .eq('accounts.clients.gestor_id', user.id)
      .single()

    if (transactionError || !currentTransaction) {
      return NextResponse.json({ 
        data: null, 
        error: 'Transação não encontrada' 
      }, { status: 404 })
    }

    // Verificar saldo se mudando tipo ou quantidade
    if (validatedData.type || validatedData.points) {
      const newType = validatedData.type || currentTransaction.type
      const newPoints = validatedData.points || currentTransaction.points
      
      // Calcular saldo simulado após reverter transação atual
      let simulatedBalance = currentTransaction.accounts.current_balance
      
      // Reverter transação atual
      if (currentTransaction.type === 'acumulo') {
        simulatedBalance -= currentTransaction.points
      } else {
        simulatedBalance += currentTransaction.points
      }
      
      // Aplicar nova transação
      if (newType === 'acumulo') {
        simulatedBalance += newPoints
      } else {
        simulatedBalance -= newPoints
      }
      
      // Verificar se saldo ficaria negativo
      if (simulatedBalance < 0) {
        return NextResponse.json({
          data: null,
          error: `Operação resultaria em saldo negativo. Saldo atual: ${currentTransaction.accounts.current_balance}, Saldo após operação: ${simulatedBalance}`
        }, { status: 409 })
      }
    }

    // Preparar dados para atualização
    const updateData: any = {}
    
    if (validatedData.type) updateData.type = validatedData.type
    if (validatedData.points) updateData.points = validatedData.points
    if (validatedData.date) updateData.date = validatedData.date
    if (validatedData.description !== undefined) updateData.description = validatedData.description || null

    // Atualizar transação
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .select(`
        id,
        account_id,
        type,
        points,
        date,
        description,
        created_at
      `)
      .single()

    if (updateError) {
      console.error('Erro ao atualizar transação:', updateError)
      return NextResponse.json({ 
        data: null, 
        error: 'Erro ao atualizar transação' 
      }, { status: 500 })
    }

    // Buscar saldo atualizado da conta
    const { data: updatedAccount } = await supabase
      .from('accounts')
      .select('current_balance')
      .eq('id', currentTransaction.account_id)
      .single()

    return NextResponse.json({
      data: {
        transaction: updatedTransaction,
        account_balance: updatedAccount?.current_balance || 0,
        operation_summary: {
          previous_transaction: {
            type: currentTransaction.type,
            points: currentTransaction.points
          },
          updated_transaction: {
            type: updatedTransaction.type,
            points: updatedTransaction.points
          },
          balance_change: (updatedAccount?.current_balance || 0) - currentTransaction.accounts.current_balance
        }
      },
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

    console.error('Erro na atualização de transação:', error)
    return NextResponse.json({ 
      data: null, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// DELETE /api/gestor/transactions/[id] - Remover transação
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transactionId = params.id
    
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

    // Buscar transação atual
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select(`
        id,
        account_id,
        type,
        points,
        date,
        description,
        accounts!inner(
          id,
          program_name,
          current_balance,
          clients!inner(
            id,
            name,
            gestor_id
          )
        )
      `)
      .eq('id', transactionId)
      .eq('accounts.clients.gestor_id', user.id)
      .single()

    if (transactionError || !transaction) {
      return NextResponse.json({ 
        data: null, 
        error: 'Transação não encontrada' 
      }, { status: 404 })
    }

    // Verificar se remoção deixaria saldo negativo
    let newBalance = transaction.accounts.current_balance
    if (transaction.type === 'acumulo') {
      newBalance -= transaction.points
    } else {
      newBalance += transaction.points
    }

    if (newBalance < 0) {
      return NextResponse.json({
        data: null,
        error: `Não é possível remover transação. Saldo ficaria negativo: ${newBalance} pontos`
      }, { status: 409 })
    }

    // Remover transação
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)

    if (deleteError) {
      console.error('Erro ao remover transação:', deleteError)
      return NextResponse.json({ 
        data: null, 
        error: 'Erro ao remover transação' 
      }, { status: 500 })
    }

    return NextResponse.json({
      data: { 
        message: 'Transação removida com sucesso',
        removed_transaction: {
          id: transactionId,
          type: transaction.type,
          points: transaction.points,
          date: transaction.date,
          account: {
            program_name: transaction.accounts.program_name,
            new_balance: newBalance
          },
          client: {
            name: transaction.accounts.clients.name
          }
        }
      },
      error: null
    })

  } catch (error) {
    console.error('Erro na remoção de transação:', error)
    return NextResponse.json({ 
      data: null, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}