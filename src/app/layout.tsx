import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/components/AuthProvider'
import { Analytics } from '@/components/analytics/Analytics'
import Script from 'next/script'
import { GA_TRACKING_ID } from '@/lib/gtag'
import { FB_PIXEL_ID } from '@/lib/fbpixel'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlyMilhas - Gestão Profissional de Milhas',
  description: 'Plataforma completa para gestão de milhas aéreas dos seus clientes',
  keywords: 'evolução profissional gestão milhas, crescimento profissional gestores, plataforma evolução gestores milhas, profissional de elite milhas aéreas',
  authors: [{ name: 'FlyMilhas' }],
  creator: 'FlyMilhas',
  publisher: 'FlyMilhas',
  robots: 'index, follow',
  openGraph: {
    title: 'FlyMilhas - Evolução Profissional para Gestores de Milhas',
    description: 'Seja um dos 500 gestores selecionados para evoluir para profissional de elite. Lançamento Q2 2025.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://flymilhas.com.br',
    siteName: 'FlyMilhas',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FlyMilhas - Gestão Profissional de Milhas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyMilhas - Evolução Profissional para Gestores de Milhas',
    description: 'Candidate-se à primeira turma de evolução profissional. Apenas 500 vagas disponíveis.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-site-verification-code', // Substitua pelo seu código
    // facebook: 'your-facebook-domain-verification', // Se necessário
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Preload important resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Favicon */}
        <link rel="icon" href="../public/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        
        {/* Preload critical resources */}
        <link rel="preload" as="image" href="/hero-image.jpg" />
        
        {/* Additional meta tags for better SEO */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_location: window.location.href,
              page_title: document.title,
            });
          `}
        </Script>
        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="flymilhas-theme"
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        {/* Analytics - Load after main content */}
            <Analytics />
            
            {/* Structured Data for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebApplication",
                  "name": "FlyMilhas",
                  "description": "Primeira plataforma de evolução profissional para gestores de milhas",
                  "url": "https://flymilhas.com.br",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "offers": {
                    "@type": "Offer",
                    "description": "Programa de evolução profissional para gestores de milhas",
                    "price": "0",
                    "priceCurrency": "BRL",
                    "availability": "https://schema.org/LimitedAvailability",
                    "validThrough": "2025-06-30"
                  },
                  "provider": {
                    "@type": "Organization",
                    "name": "FlyMilhas",
                    "url": "https://flymilhas.com.br"
                  }
                })
              }}
            />
        
      </body>
    </html>
  )
}