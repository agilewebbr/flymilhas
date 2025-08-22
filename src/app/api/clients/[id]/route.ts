// src/app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Função auxiliar para extrair o access token
function getAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  const cookieHeader = request.headers.get('cookie') || ''
  
  let accessToken = ''
  if (authHeader?.startsWith('Bearer ')) {
    accessToken = authHeader.split(' ')[1]
  } else {
    const tokenMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/)
    if (tokenMatch) {
      try {
        const tokenData = JSON.parse(decodeURIComponent(tokenMatch[1]))
        accessToken = tokenData.access_token
      } catch (e) {
        return null
      }
    }
  }
  
  return accessToken || null
}

// Função auxiliar para autenticar usuário
async function authenticateUser(accessToken: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: ''
  })

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { user: null, supabase: null, error: 'Usuário não autorizado' }
  }

  return { user, supabase, error: null }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json(
        { data: null, error: 'Token não encontrado' },
        { status: 401 }
      )
    }

    const { user, supabase, error } = await authenticateUser(accessToken)
    if (error || !user || !supabase) {
      return NextResponse.json(
        { data: null, error: error || 'Erro de autenticação' },
        { status: 401 }
      )
    }

    const { data: client, error: fetchError } = await supabase
      .from('clients')
      .select(`
        *,
        accounts:accounts(
          id,
          program_name,
          current_balance,
          account_number,
          status,
          created_at,
          updated_at
        )
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'Cliente não encontrado' },
          { status: 404 }
        )
      }
      
      console.error('Erro ao buscar cliente:', fetchError)
      return NextResponse.json(
        { data: null, error: 'Erro ao buscar cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: client,
      error: null
    })

  } catch (error) {
    console.error('Erro na API de cliente:', error)
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
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json(
        { data: null, error: 'Token não encontrado' },
        { status: 401 }
      )
    }

    const { user, supabase, error } = await authenticateUser(accessToken)
    if (error || !user || !supabase) {
      return NextResponse.json(
        { data: null, error: error || 'Erro de autenticação' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    if (!body.name?.trim()) {
      return NextResponse.json(
        { data: null, error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const { data: updatedClient, error: updateError } = await supabase
      .from('clients')
      .update({
        name: body.name.trim(),
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        notes: body.notes?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'Cliente não encontrado' },
          { status: 404 }
        )
      }
      
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
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json(
        { data: null, error: 'Token não encontrado' },
        { status: 401 }
      )
    }

    const { user, supabase, error } = await authenticateUser(accessToken)
    if (error || !user || !supabase) {
      return NextResponse.json(
        { data: null, error: error || 'Erro de autenticação' },
        { status: 401 }
      )
    }

    // Verificar se o cliente existe e pertence ao usuário
    const { data: existingClient, error: checkError } = await supabase
      .from('clients')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingClient) {
      return NextResponse.json(
        { data: null, error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Deletar o cliente
    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

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