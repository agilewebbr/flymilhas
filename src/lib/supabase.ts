// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Para landing page pública
  }
})

// Tipos para a tabela de leads
export interface Lead {
  id?: string
  created_at?: string
  updated_at?: string
  nome_completo: string
  email: string
  whatsapp: string
  tempo_milhas: string
  quantidade_clientes: string
  objetivo_profissional: string
  desafio_atual: string
  inicio_evolucao: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  user_agent?: string
  ip_address?: string
  status?: string
  tags?: string[]
  score?: number
  first_contact_at?: string
  qualified_at?: string
  converted_at?: string
}

// Função para capturar metadados UTM
export function getUTMParams(): Partial<Lead> {
  if (typeof window === 'undefined') return {}
  
  const urlParams = new URLSearchParams(window.location.search)
  const referrer = document.referrer || undefined
  const userAgent = navigator.userAgent
  
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    referrer,
    user_agent: userAgent
  }
}