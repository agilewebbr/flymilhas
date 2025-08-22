// src/app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: client, error } = await supabase
      .from('clients')
      .select(`
        *,
        accounts:accounts(
          id,
          program_name,
          account_number,
          current_balance,
          currency
        )
      `)
      .eq('id', params.id)
      .eq('gestor_id', user.id)
      .single()

    if (error) {
      console.error('Erro ao buscar cliente:', error)
      return NextResponse.json(
        { data: null, error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: client,
      error: null
    })

  } catch (error) {
    console.error('Erro ao buscar cliente:', error)
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

    // Preparar dados para atualização
    const updateData = {
      name: body.name.trim(),
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      notes: body.notes?.trim() || null,
      updated_at: new Date().toISOString()
    }

    // Atualizar cliente
    const { data: updatedClient, error: updateError } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', params.id)
      .eq('gestor_id', user.id)
      .select('*')
      .single()

    if (updateError) {
      console.error('Erro ao atualizar cliente:', updateError)
      return NextResponse.json(
        { data: null, error: 'Erro ao atualizar cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: updatedClient,
      error: null
    })

  } catch (error) {
    console.error('Erro ao atualizar cliente:', error)
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
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { data: null, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o cliente possui contas (impedir exclusão)
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('id')
      .eq('client_id', params.id)
      .limit(1)

    if (accountsError) {
      console.error('Erro ao verificar contas:', accountsError)
      return NextResponse.json(
        { data: null, error: 'Erro ao verificar contas do cliente' },
        { status: 500 }
      )
    }

    if (accounts && accounts.length > 0) {
      return NextResponse.json(
        { data: null, error: 'Não é possível excluir cliente com contas cadastradas' },
        { status: 400 }
      )
    }

    // Deletar cliente
    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', params.id)
      .eq('gestor_id', user.id)

    if (deleteError) {
      console.error('Erro ao deletar cliente:', deleteError)
      return NextResponse.json(
        { data: null, error: 'Erro ao deletar cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: { success: true },
      error: null
    })

  } catch (error) {
    console.error('Erro ao deletar cliente:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}