import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { updateClientSchema } from '@/lib/validations/client'
import { z } from 'zod'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/gestor/clients/[id] - Buscar cliente específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    
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

    // Buscar cliente com contas
    const { data: client, error } = await supabase
      .from('clients')
      .select(`
        *,
        accounts (
          id,
          program_name,
          account_number,
          current_balance,
          currency,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .eq('gestor_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
      }
      console.error('Erro ao buscar cliente:', error)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    return NextResponse.json(client)

  } catch (error) {
    console.error('Erro na API de cliente específico:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT /api/gestor/clients/[id] - Atualizar cliente
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()
    const validatedData = updateClientSchema.parse(body)
    
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

    // Atualizar cliente
    const { data: updatedClient, error: updateError } = await supabase
      .from('clients')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('gestor_id', user.id)
      .select()
      .single()

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
      }
      console.error('Erro ao atualizar cliente:', updateError)
      return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 })
    }

    return NextResponse.json(updatedClient)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Erro na atualização de cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE /api/gestor/clients/[id] - Deletar cliente
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    
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

    // Verificar se cliente existe e pertence ao gestor
    const { data: existingClient, error: checkError } = await supabase
      .from('clients')
      .select('id')
      .eq('id', id)
      .eq('gestor_id', user.id)
      .single()

    if (checkError || !existingClient) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    // Deletar cliente (cascata irá deletar contas e transações)
    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('gestor_id', user.id)

    if (deleteError) {
      console.error('Erro ao deletar cliente:', deleteError)
      return NextResponse.json({ error: 'Erro ao deletar cliente' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Cliente deletado com sucesso' })

  } catch (error) {
    console.error('Erro na deleção de cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}