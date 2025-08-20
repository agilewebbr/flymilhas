'use client'

import { useScrollTracking } from '@/hooks/useScrollTracking'

interface LandingPageClientProps {
  children: React.ReactNode
}

export function LandingPageClient({ children }: LandingPageClientProps) {
  // Ativar tracking de scroll apenas neste componente
  useScrollTracking()

  return (
    <main>
      {children}
    </main>
  )
}