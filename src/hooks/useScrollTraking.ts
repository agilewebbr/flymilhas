// hooks/useScrollTracking.ts
import { useEffect } from 'react'
import * as gtag from '@/lib/gtag'

export const useScrollTracking = () => {
  useEffect(() => {
    const scrollDepths = [25, 50, 75, 100]
    const trackedDepths = new Set<number>()

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      scrollDepths.forEach(depth => {
        if (scrollPercent >= depth && !trackedDepths.has(depth)) {
          trackedDepths.add(depth)
          gtag.trackScrollDepth(depth)
        }
      })
    }

    // Adicionar listener de scroll
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Cleanup: remover listener quando componente for desmontado
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}