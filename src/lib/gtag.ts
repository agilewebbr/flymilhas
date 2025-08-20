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

// Função específica para testar
export const trackTest = () => {
  event('test_event', {
    event_category: 'test',
    event_label: 'implementacao_basica'
  })
}