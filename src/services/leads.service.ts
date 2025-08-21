// src/services/leads.service.ts
import { supabase } from '@/lib/supabase'

export interface CreateLeadData {
  nomeCompleto: string
  email: string
  whatsapp: string
  tempoMilhas: string
  quantidadeClientes: string
  objetivoProfissional: string
  desafioAtual: string
  inicioEvolucao: string
}

export interface LeadResponse {
  success: boolean
  data?: any
  error?: string
  score?: number
}

// Função para capturar UTMs
function getUTMParams() {
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

class LeadsService {
  async createLead(data: CreateLeadData): Promise<LeadResponse> {
    try {
      console.log('🔍 DEBUG: Iniciando createLead com dados:', data)
      console.log('🔍 DEBUG: Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('🔍 DEBUG: Supabase Key existe:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      // Converter dados do formulário para o formato do banco
      const leadData = {
        nome_completo: data.nomeCompleto,
        email: data.email.toLowerCase().trim(),
        whatsapp: this.formatWhatsApp(data.whatsapp),
        tempo_milhas: data.tempoMilhas,
        quantidade_clientes: data.quantidadeClientes,
        objetivo_profissional: data.objetivoProfissional,
        desafio_atual: data.desafioAtual,
        inicio_evolucao: data.inicioEvolucao,
        status: 'novo',
        // Campos UTM opcionais
        ...getUTMParams()
      }

      console.log('🔍 DEBUG: Dados formatados para inserção:', leadData)

      // CORREÇÃO: Verificar email existente sem .single()
      const { data: existingLeads, error: checkError } = await supabase
        .from('leads')
        .select('id, email, score')
        .eq('email', leadData.email)
        .limit(1)

      console.log('🔍 DEBUG: Verificação de email existente:', { existingLeads, checkError })

      if (checkError) {
        console.error('🔍 DEBUG: Erro ao verificar email:', checkError)
        return {
          success: false,
          error: 'Erro ao verificar dados. Tente novamente.'
        }
      }

      if (existingLeads && existingLeads.length > 0) {
        return {
          success: false,
          error: 'Este email já está cadastrado. Você já está na lista dos 500!'
        }
      }

      // CORREÇÃO: Inserir novo lead com estrutura simplificada
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select('*')
        .single()

      console.log('🔍 DEBUG: Resultado da inserção:', { newLead, error })

      if (error) {
        console.error('🔍 DEBUG: Erro detalhado ao salvar lead:', JSON.stringify(error, null, 2))
        return {
          success: false,
          error: 'Erro interno. Tente novamente em alguns minutos.'
        }
      }

      // Log para analytics
      this.trackLeadCreation(newLead)

      return {
        success: true,
        data: newLead,
        score: newLead.score
      }

    } catch (error) {
      console.error('🔍 DEBUG: Erro inesperado completo:', JSON.stringify(error, null, 2))
      return {
        success: false,
        error: 'Erro inesperado. Verifique sua conexão e tente novamente.'
      }
    }
  }

  private formatWhatsApp(whatsapp: string): string {
    // Remove tudo que não é número
    const numbers = whatsapp.replace(/\D/g, '')
    
    // Adiciona código do país se não tiver
    if (numbers.length === 11 && numbers.startsWith('11')) {
      return `+55${numbers}`
    } else if (numbers.length === 10) {
      return `+5511${numbers}`
    } else if (numbers.length === 13 && numbers.startsWith('55')) {
      return `+${numbers}`
    }
    
    return `+55${numbers}`
  }

  private trackLeadCreation(lead: any) {
    // Integração com Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'lead_generation', {
        'event_category': 'engagement',
        'event_label': 'application_form',
        'value': lead.score || 0,
        'tempo_milhas': lead.tempo_milhas,
        'quantidade_clientes': lead.quantidade_clientes,
        'objetivo_profissional': lead.objetivo_profissional
      })
    }

    // Integração com Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'FlyMilhas Evolution Application',
        content_category: 'lead_generation',
        value: lead.score || 0,
        currency: 'BRL'
      })
    }

    // Log estruturado para análise
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Novo Lead Capturado:', {
        timestamp: new Date().toISOString(),
        leadId: lead.id,
        score: lead.score,
        profile: {
          tempo_milhas: lead.tempo_milhas,
          quantidade_clientes: lead.quantidade_clientes,
          objetivo: lead.objetivo_profissional,
          urgencia: lead.inicio_evolucao
        },
        utm: {
          source: lead.utm_source,
          medium: lead.utm_medium,
          campaign: lead.utm_campaign
        }
      })
    }
  }

  // Método para teste de conectividade
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('count(*)', { count: 'exact' })
        .limit(0)

      if (error) {
        console.error('🔍 DEBUG: Erro de conectividade:', error)
        return { success: false, error: error.message }
      }

      console.log('🔍 DEBUG: Conectividade OK, total de leads:', data)
      return { success: true }
    } catch (error) {
      console.error('🔍 DEBUG: Erro de conexão:', error)
      return { success: false, error: 'Erro de conexão' }
    }
  }
}

export const leadsService = new LeadsService()