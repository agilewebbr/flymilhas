// src/lib/fbpixel.ts
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID!

// Rastrear visualização de página
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView')
  }
}

// Rastrear eventos padrão
export const event = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options)
  }
}

// Rastrear eventos personalizados
export const customEvent = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', name, options)
  }
}

// ========== EVENTOS ESPECÍFICOS DO FLYMILHAS ==========

// 1. FORMULÁRIO - Conversão principal (lead enviado)
export const trackLead = (leadData: {
  nome?: string
  email?: string
  experiencia?: string
  clientes_atuais?: string
  qualification_score?: number
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}) => {
  event('Lead', {
    content_name: 'FlyMilhas Evolution Application',
    content_category: 'Professional Development',
    value: 197.00,
    currency: 'BRL',
    ...leadData
  })
  console.log('🔵 FB Pixel: Lead tracked', leadData)
}

// 2. FORMULÁRIO - Registro completo
export const trackCompleteRegistration = (userData: any) => {
  event('CompleteRegistration', {
    content_name: 'FlyMilhas Application Complete',
    value: 197.00,
    currency: 'BRL',
    ...userData
  })
  console.log('🔵 FB Pixel: CompleteRegistration tracked', userData)
}

// 3. FORMULÁRIO - Início do formulário
export const trackInitiateCheckout = () => {
  event('InitiateCheckout', {
    content_name: 'FlyMilhas Application Start',
    content_category: 'Lead Generation'
  })
  console.log('🔵 FB Pixel: InitiateCheckout tracked')
}

// 4. SEÇÕES - Visualização de conteúdo
export const trackViewContent = (sectionName: string) => {
  event('ViewContent', {
    content_name: sectionName,
    content_type: 'section'
  })
  console.log('🔵 FB Pixel: ViewContent tracked', sectionName)
}

// 5. EVENTO PERSONALIZADO - Aplicação FlyMilhas
export const trackFlyMilhasApplication = (formData: any) => {
  customEvent('FlyMilhas_Evolution_Application', formData)
  console.log('🔵 FB Pixel: FlyMilhas_Evolution_Application tracked', formData)
}

// 6. EVENTO PERSONALIZADO - Interesse profissional
export const trackProfessionalInterest = (interactionData: any) => {
  customEvent('Professional_Evolution_Interest', interactionData)
  console.log('🔵 FB Pixel: Professional_Evolution_Interest tracked', interactionData)
}

// 7. TESTE - Para verificar se está funcionando
export const trackTest = (testType: string) => {
  customEvent('Test_Event', {
    test_type: testType
  })
  console.log('🔵 FB Pixel: Test Event tracked', testType)
}