// src/app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Pegar token do header Authorization ou cookies
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie') || ''
    
    let accessToken = ''
    if (authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.split(' ')[1]
    } else {
      // Tentar extrair do cookie como fallback
      const tokenMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/)
      if (tokenMatch) {
        try {
          const tokenData = JSON.parse(decodeURIComponent(tokenMatch[1]))
          accessToken = tokenData.access_token
        } catch (e) {
          // Ignore parsing errors
        }
      }
    }

    if (!accessToken) {
      return NextResponse.json(
        { data: null, error: 'Token não encontrado' },
        { status: 401 }
      )
    }

    // Criar cliente Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Definir sessão usando o token
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: '' // Não precisamos para esta operação
    })

    // Verificar usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { data: null, error: 'Usuário não autorizado' },
        { status: 401 }
      )
    }

    // Buscar clientes
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('clients')
      .select(`
        *,
        accounts:accounts(
          id,
          program_name,
          current_balance
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data: clients, error: fetchError, count } = await query
      .range(offset, offset + limit - 1)

    if (fetchError) {
      console.error('Erro ao buscar clientes:', fetchError)
      return NextResponse.json(
        { data: null, error: 'Erro ao buscar clientes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: {
        clients: clients || [],
        pagination: {
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
          totalCount: count || 0
        }
      },
      error: null
    })

  } catch (error) {
    console.error('Erro na API de clientes:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Mesma lógica de autenticação
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
          // Ignore parsing errors
        }
      }
    }

    if (!accessToken) {
      return NextResponse.json(
        { data: null, error: 'Token não encontrado' },
        { status: 401 }
      )
    }

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
      return NextResponse.json(
        { data: null, error: 'Usuário não autorizado' },
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

    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        name: body.name.trim(),
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        notes: body.notes?.trim() || null
      })
      .select('*')
      .single()

    if (insertError) {
      console.error('Erro ao criar cliente:', insertError)
      return NextResponse.json(
        { data: null, error: 'Erro ao criar cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: newClient, error: null })

  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json(
      { data: null, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}