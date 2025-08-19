// src/components/Analytics.tsx
'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface AnalyticsProps {
  googleAnalyticsId?: string
  facebookPixelId?: string
}

export function Analytics({ 
  googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  facebookPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID 
}: AnalyticsProps) {
  const pathname = usePathname()

  // Track page views on route change
  useEffect(() => {
    if (googleAnalyticsId && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', googleAnalyticsId, {
        page_path: pathname,
      })
    }

    if (facebookPixelId && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView')
    }
  }, [pathname, googleAnalyticsId, facebookPixelId])

  return (
    <>
      {/* Google Analytics 4 */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', '${googleAnalyticsId}', {
                  page_title: 'FlyMilhas - Evolução Profissional',
                  custom_map: {
                    'custom_parameter_1': 'lead_score',
                    'custom_parameter_2': 'tempo_milhas',
                    'custom_parameter_3': 'quantidade_clientes'
                  }
                });

                // Enhanced ecommerce
                gtag('config', '${googleAnalyticsId}', {
                  send_page_view: true,
                  allow_google_signals: true,
                  allow_ad_personalization_signals: true
                });
              `,
            }}
          />
        </>
      )}

      {/* Facebook Pixel */}
      {facebookPixelId && (
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              
              fbq('init', '${facebookPixelId}');
              fbq('track', 'PageView');

              // Configurações avançadas
              fbq('set', 'agent', 'flymilhas', '1.0');
              
              // Configurar eventos automáticos
              fbq('trackCustom', 'FlyMilhasPageView', {
                page_type: 'landing_page',
                content_name: 'Evolução Profissional',
                content_category: 'lead_generation'
              });
            `,
          }}
        />
      )}

      {/* NoScript para Facebook Pixel */}
      {facebookPixelId && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  )
}

// Tipos para eventos de tracking
export interface TrackingEventData {
  event_category?: string
  event_label?: string
  value?: number
  lead_score?: number
  tempo_milhas?: string
  quantidade_clientes?: string
  objetivo_profissional?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

// Utility functions para tracking
export const analytics = {
  // Google Analytics 4 Events
  ga4: {
    trackEvent: (eventName: string, parameters: TrackingEventData = {}) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, {
          event_category: parameters.event_category || 'engagement',
          event_label: parameters.event_label,
          value: parameters.value,
          custom_parameter_1: parameters.lead_score,
          custom_parameter_2: parameters.tempo_milhas,
          custom_parameter_3: parameters.quantidade_clientes,
          ...parameters
        })
      }
    },

    trackConversion: (conversionId: string, data: TrackingEventData = {}) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          send_to: conversionId,
          value: data.value || data.lead_score || 50,
          currency: 'BRL',
          transaction_id: `lead_${Date.now()}`
        })
      }
    },

    trackLeadGeneration: (leadData: TrackingEventData) => {
      analytics.ga4.trackEvent('lead_generation', {
        event_category: 'conversion',
        event_label: 'evolution_application',
        value: leadData.lead_score || 50,
        ...leadData
      })
    }
  },

  // Facebook Pixel Events
  facebook: {
    trackEvent: (eventName: string, parameters: Record<string, any> = {}) => {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', eventName, parameters)
      }
    },

    trackCustomEvent: (eventName: string, parameters: Record<string, any> = {}) => {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('trackCustom', eventName, parameters)
      }
    },

    trackLead: (leadData: TrackingEventData) => {
      analytics.facebook.trackEvent('Lead', {
        content_name: 'FlyMilhas Evolution Application',
        content_category: 'lead_generation',
        value: leadData.lead_score || 50,
        currency: 'BRL',
        predicted_ltv: (leadData.lead_score || 50) * 2,
        status: 'qualified'
      })
    },

    trackCompleteRegistration: (leadData: TrackingEventData) => {
      analytics.facebook.trackEvent('CompleteRegistration', {
        content_name: 'Professional Evolution Program',
        value: leadData.lead_score || 50,
        currency: 'BRL',
        registration_method: 'landing_page_form'
      })
    }
  },

  // Combined tracking for key events
  trackFormStart: (data: Partial<TrackingEventData> = {}) => {
    analytics.ga4.trackEvent('form_start', {
      event_category: 'engagement',
      event_label: 'evolution_application_start',
      ...data
    })

    analytics.facebook.trackEvent('InitiateCheckout', {
      content_name: 'Evolution Application Form',
      content_category: 'form_interaction'
    })
  },

  trackFormSubmission: (leadData: TrackingEventData) => {
    // GA4 tracking
    analytics.ga4.trackLeadGeneration(leadData)
    
    // Facebook tracking
    analytics.facebook.trackLead(leadData)
    analytics.facebook.trackCompleteRegistration(leadData)

    // Custom events
    analytics.facebook.trackCustomEvent('FlyMilhas_Evolution_Application', {
      lead_score: leadData.lead_score,
      tempo_milhas: leadData.tempo_milhas,
      quantidade_clientes: leadData.quantidade_clientes,
      objetivo_profissional: leadData.objetivo_profissional,
      valor_estimado: (leadData.lead_score || 50) * 10
    })
  },

  trackCTAClick: (ctaName: string, section: string) => {
    analytics.ga4.trackEvent('cta_click', {
      event_category: 'engagement',
      event_label: `${section}_${ctaName}`,
      value: 1
    })

    analytics.facebook.trackCustomEvent('CTAClick', {
      cta_name: ctaName,
      section: section,
      page_type: 'landing_page'
    })
  },

  trackScrollDepth: (percentage: number) => {
    if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
      analytics.ga4.trackEvent('scroll', {
        event_category: 'engagement',
        event_label: `scroll_${percentage}`,
        value: percentage
      })
    }
  }
}

// Hook para tracking automático de scroll
export function useScrollTracking() {
  useEffect(() => {
    let trackedPercentages: number[] = []

    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = Math.round((scrollTop / docHeight) * 100)

      // Track milestones
      const milestones = [25, 50, 75, 100]
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !trackedPercentages.includes(milestone)) {
          trackedPercentages.push(milestone)
          analytics.trackScrollDepth(milestone)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}