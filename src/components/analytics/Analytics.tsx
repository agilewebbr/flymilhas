// src/components/analytics/Analytics.tsx
'use client'

import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
    dataLayer: any[]
  }
}

interface AnalyticsProps {
  children: React.ReactNode
}

export function Analytics({ children }: AnalyticsProps) {
  const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

  useEffect(() => {
    // Verificar se o usuário consentiu com cookies
    const cookieConsent = localStorage.getItem('cookie-consent')
    
    if (cookieConsent === 'accepted') {
      // Inicializar analytics apenas se houver consentimento
      if (GA_ID && typeof window !== 'undefined') {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted'
        })
      }
      
      if (FB_PIXEL_ID && typeof window !== 'undefined') {
        window.fbq('consent', 'grant')
      }
    }
  }, [GA_ID, FB_PIXEL_ID])

  return (
    <>
      {/* Google Analytics 4 */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
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
                
                // Configuração de consentimento (LGPD)
                gtag('consent', 'default', {
                  analytics_storage: 'denied',
                  ad_storage: 'denied',
                  wait_for_update: 500
                });
                
                gtag('config', '${GA_ID}', {
                  page_title: 'FlyMilhas - Evolução Profissional',
                  page_location: window.location.href,
                  send_page_view: true,
                  // Configurações de privacidade
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false
                });
                
                // Configurar enhanced measurement
                gtag('config', '${GA_ID}', {
                  enhanced_measurements: {
                    scrolls: true,
                    outbound_clicks: true,
                    site_search: false,
                    video_engagement: false,
                    file_downloads: true
                  }
                });
              `,
            }}
          />
        </>
      )}

      {/* Facebook Pixel */}
      {FB_PIXEL_ID && (
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
              
              // Configuração de consentimento (LGPD)
              fbq('consent', 'revoke');
              
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
              
              // Evento personalizado para landing page
              fbq('track', 'ViewContent', {
                content_name: 'FlyMilhas Landing Page',
                content_category: 'landing_page',
                content_type: 'website'
              });
            `,
          }}
        />
      )}

      {children}
    </>
  )
}