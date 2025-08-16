import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' })
  }

  try {
    // Usar supabaseAdmin para bypasse RLS
    const { data: profile, error } = await supabaseAdmin!
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    return NextResponse.json({
      profile_exists: !!profile,
      profile: profile,
      error: error?.message || null
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}