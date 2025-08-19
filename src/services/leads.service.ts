// src/services/leads.service.ts
import { supabase, Lead, getUTMParams } from '@/lib/supabase'

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
  data?: Lead
  error?: string
  score?: number
}

class LeadsService {
  async createLead(data: CreateLeadData): Promise<LeadResponse> {
    try {
      // Converter dados do formulário para o formato do banco
      const leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'> = {
        nome_completo: data.nomeCompleto,
        email: data.email.toLowerCase().trim(),
        whatsapp: this.formatWhatsApp(data.whatsapp),
        tempo_milhas: data.tempoMilhas,
        quantidade_clientes: data.quantidadeClientes,
        objetivo_profissional: data.objetivoProfissional,
        desafio_atual: data.desafioAtual,
        inicio_evolucao: data.inicioEvolucao,
        status: 'novo',
        ...getUTMParams() // Adiciona UTMs automaticamente
      }

      // Verificar se já existe lead com este email
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id, email, score')
        .eq('email', leadData.email)
        .single()

      if (existingLead) {
        return {
          success: false,
          error: 'Este email já está cadastrado. Você já está na lista dos 500!'
        }
      }

      // Inserir novo lead
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select('*')
        .single()

      if (error) {
        console.error('Erro ao salvar lead:', error)
        return {
          success: false,
          error: 'Erro interno. Tente novamente em alguns minutos.'
        }
      }

      // Log para analytics (opcional)
      this.trackLeadCreation(newLead)

      return {
        success: true,
        data: newLead,
        score: newLead.score
      }

    } catch (error) {
      console.error('Erro inesperado ao criar lead:', error)
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

  private trackLeadCreation(lead: Lead) {
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

  // Método para analytics de abandono de formulário
  async trackFormAbandonment(fieldName: string, formData: Partial<CreateLeadData>) {
    try {
      // Opcional: salvar dados parciais para remarketing
      if (formData.email && this.isValidEmail(formData.email)) {
        const partialLead = {
          email: formData.email.toLowerCase().trim(),
          nome_completo: formData.nomeCompleto || '',
          status: 'abandonou_formulario',
          tags: ['formulario_incompleto'],
          ...getUTMParams()
        }

        await supabase
          .from('leads')
          .upsert([partialLead], { onConflict: 'email' })
      }

      // Track no analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'form_abandonment', {
          'event_category': 'engagement',
          'event_label': fieldName,
          'form_completion': this.calculateFormCompletion(formData)
        })
      }
    } catch (error) {
      console.error('Erro ao rastrear abandono:', error)
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return emailRegex.test(email)
  }

  private calculateFormCompletion(data: Partial<CreateLeadData>): number {
    const fields = [
      'nomeCompleto', 'email', 'whatsapp', 'tempoMilhas', 
      'quantidadeClientes', 'objetivoProfissional', 'desafioAtual', 'inicioEvolucao'
    ]
    const filledFields = fields.filter(field => data[field as keyof CreateLeadData])
    return Math.round((filledFields.length / fields.length) * 100)
  }

  // Método para obter estatísticas de leads (para dashboard interno)
  async getLeadsStats() {
    try {
      const { data, error } = await supabase
        .from('leads_summary')
        .select('*')

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      return { success: false, error: 'Erro ao carregar estatísticas' }
    }
  }
}

export const leadsService = new LeadsService()