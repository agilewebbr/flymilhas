// lib/gtag.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!

// Rastrear visualização de página
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

// Rastrear eventos personalizados
export const event = (
  action: string,
  parameters: {
    event_category?: string
    event_label?: string
    value?: number
    [key: string]: any
  }
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, parameters)
  }
}

// ========== EVENTOS ESPECÍFICOS DO FLYMILHAS ==========

// 1. FORMULÁRIO - Início do preenchimento
export const trackFormStart = () => {
  event('form_start', {
    form_id: 'flymilhas_application',
    form_name: 'Candidatura FlyMilhas',
    event_category: 'formulario',
    event_label: 'inicio_preenchimento'
  })
  console.log('🟢 GA4: Form Start tracked')
}

// 2. FORMULÁRIO - Conversão principal (lead enviado)
export const trackLeadGeneration = (leadData: {
  nome?: string
  email?: string
  experiencia?: string
  clientes_atuais?: string
  qualification_score?: number
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}) => {
  event('lead_generation', {
    currency: 'BRL',
    value: 197.00,
    lead_source: 'landing_page',
    form_name: 'Candidatura FlyMilhas',
    event_category: 'conversao',
    event_label: 'formulario_enviado',
    ...leadData
  })
  console.log('🟢 GA4: Lead Generation tracked', leadData)
}

// 3. SCROLL - Profundidade de navegação
export const trackScrollDepth = (percent: number) => {
  event('scroll', {
    percent_scrolled: percent,
    event_category: 'engajamento',
    event_label: `scroll_${percent}%`
  })
  console.log(`🟢 GA4: Scroll ${percent}% tracked`)
}

// 4. CTA - Cliques em botões importantes
export const trackCTAClick = (ctaText: string, location: string, section: string) => {
  event('cta_click', {
    cta_text: ctaText,
    cta_location: location,
    page_section: section,
    event_category: 'engajamento',
    event_label: 'cta_clicado'
  })
  console.log('🟢 GA4: CTA Click tracked', { ctaText, location, section })
}

// 5. FORMULÁRIO - Erro de validação
export const trackFormError = (errorType: string, fieldName: string) => {
  event('form_error', {
    form_id: 'flymilhas_application',
    error_type: errorType,
    field_name: fieldName,
    event_category: 'formulario',
    event_label: 'erro_validacao'
  })
  console.log('🟢 GA4: Form Error tracked', { errorType, fieldName })
}

// 6. FORMULÁRIO - Abandono (usuário saiu sem enviar)
export const trackFormAbandonment = (fieldsCompleted: number, totalFields: number, timeSpent: number) => {
  event('form_abandonment', {
    form_id: 'flymilhas_application',
    fields_completed: fieldsCompleted,
    total_fields: totalFields,
    time_spent: timeSpent,
    completion_rate: Math.round((fieldsCompleted / totalFields) * 100),
    event_category: 'formulario',
    event_label: 'abandono'
  })
  console.log('🟢 GA4: Form Abandonment tracked', { fieldsCompleted, totalFields, timeSpent })
}

// 7. TESTE - Para verificar se está funcionando
export const trackTest = (testType: string) => {
  event('test_event', {
    test_type: testType,
    event_category: 'teste',
    event_label: 'implementacao_eventos'
  })
  console.log('🟢 GA4: Test Event tracked', testType)
}