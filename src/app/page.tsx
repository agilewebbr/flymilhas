import { Metadata } from 'next'
import { HeroSection } from '@/components/landing/hero-section'
import { ProblemSection } from '@/components/landing/problem-section'
import { EvolutionSection } from '@/components/landing/evolution-section'
import { DemoSection } from '@/components/landing/demo-section'
import { BenefitsSection } from '@/components/landing/benefits-section'
import { CredibilitySection } from '@/components/landing/credibility-section'
import { UrgencySection } from '@/components/landing/urgency-section'
import { ApplicationForm } from '@/components/landing/application-form'
import { FloatingCTA } from '@/components/landing/floating-cta'
import { LandingNavbar } from '@/components/landing/landing-navbar'
import { LandingFooter } from '@/components/landing/landing-footer'
import { useScrollTracking } from '@/hooks/useScrollTracking'
import { LandingPageClient } from '@/components/landing/landing-page-client'

export const metadata: Metadata = {
  title: 'FlyMilhas - Evolução Profissional | Primeira Plataforma de Crescimento para Gestores de Milhas',
  description: 'Candidate-se à evolução profissional. A primeira plataforma para gestores que querem crescer e ser reconhecidos como profissionais de elite. Lançamento Q2 2025. Preço founder 50% OFF.',
  keywords: 'evolução profissional gestão milhas, crescimento profissional gestores, plataforma evolução gestores milhas, profissional de elite milhas aéreas',
  creator: 'FlyClube',
  publisher: 'FlyMilhas',
  openGraph: {
    title: 'FlyMilhas - Evolução Profissional para Gestores de Milhas',
    description: 'Seja um dos 500 gestores selecionados para evoluir para profissional de elite. Lançamento Q2 2025.',
    url: 'https://flymilhas.com.br',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyMilhas - Evolução Profissional para Gestores de Milhas',
    description: 'Candidate-se à primeira turma de evolução profissional. Apenas 500 vagas disponíveis.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Server Component - sem hooks */}
      {/* Navigation */}
      <LandingNavbar />
      
      {/* Client Component - com tracking */}
      <LandingPageClient>
        {/* Main Content */}
        <main className="relative">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Problem/Aspiration Section */}
          <ProblemSection />
          
          {/* Evolution Section */}
          <EvolutionSection />
          
          {/* Demo Section */}
          <DemoSection />
          
          {/* Benefits Section */}
          <BenefitsSection />
          
          {/* Credibility Section */}
          <CredibilitySection />
          
          {/* Urgency Section */}
          <UrgencySection />
          
          {/* Application Form */}
          <ApplicationForm />
        </main>
      </LandingPageClient>
      
      {/* Floating CTA */}
      <FloatingCTA />
      
      {/* Footer */}
      <LandingFooter />
    </div>
  )
}