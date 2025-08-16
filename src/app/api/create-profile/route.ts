import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  const { userId, name, role } = await request.json()
  
  if (!userId || !name || !role) {
    return NextResponse.json({ error: 'userId, name, and role required' })
  }

  try {
    // Usar supabaseAdmin para bypasse RLS
    const { data: profile, error } = await supabaseAdmin!
      .from('profiles')
      .insert({
        user_id: userId,
        name,
        role
      })
      .select()
      .single()

    return NextResponse.json({
      success: !error,
      profile: profile,
      error: error?.message || null
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}