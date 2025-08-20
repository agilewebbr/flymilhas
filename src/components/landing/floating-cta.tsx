'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Rocket, 
  X, 
  ArrowRight, 
  Crown,
  TrendingUp,
  Users
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import * as gtag from '@/lib/gtag'

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentVariant, setCurrentVariant] = useState(0)

  const ctaVariants = [
    {
      icon: Rocket,
      text: "Evoluir Para Elite",
      subtext: "50% OFF Pioneiro",
      bgClass: "from-primary to-primary/90",
      iconColor: "text-primary-foreground"
    },
    {
      icon: Crown,
      text: "Ser Profissional Elite",
      subtext: "500 vagas restantes",
      bgClass: "from-yellow-500 to-orange-500",
      iconColor: "text-white"
    },
    {
      icon: TrendingUp,
      text: "Candidatar-se Agora",
      subtext: "Evolução em 90 dias",
      bgClass: "from-green-500 to-emerald-500",
      iconColor: "text-white"
    },
    {
      icon: Users,
      text: "Juntar aos 500",
      subtext: "Primeiros pioneiros",
      bgClass: "from-purple-500 to-blue-500",
      iconColor: "text-white"
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const windowHeight = window.innerHeight
      
      // Mostra o CTA após 50% de scroll e se não foi dispensado
      if (scrolled > windowHeight * 0.5 && !isDismissed) {
        setIsVisible(true)
      } else if (scrolled <= windowHeight * 0.3) {
        setIsVisible(false)
      }
    }

    // Rotaciona as variações do CTA a cada 10 segundos
    const rotateVariants = setInterval(() => {
      setCurrentVariant(prev => (prev + 1) % 4) // 4 é o número fixo de variantes
    }, 10000)

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(rotateVariants)
    }
  }, [isDismissed])

  const scrollToForm = () => {
    gtag.trackCTAClick(currentCTA.text, 'floating_cta', 'floating_section')
    const element = document.getElementById('candidatura')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsDismissed(true) // Oculta o CTA após clicar
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  const currentCTA = ctaVariants[currentVariant] || ctaVariants[0]

  return (
    <>
      {/* Desktop - Scroll Progress CTA */}
      <AnimatePresence>
        {isVisible && !isDismissed && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-primary/95 to-secondary/95 backdrop-blur-md border-b border-primary/20 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <currentCTA.icon className="h-6 w-6 text-primary-foreground" />
                  <div>
                    <p className="text-sm font-medium text-primary-foreground">
                      Cansado de planilhas? Teste a primeira solução profissional
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    onClick={scrollToForm}
                    size="sm"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    Sim, Quero Testar
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  
                  <button
                    onClick={handleDismiss}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile - Bottom Fixed CTA */}
      <AnimatePresence>
        {isVisible && !isDismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <div className="relative">
              {/* Main CTA Button */}
              <motion.div
                key={currentVariant}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "bg-gradient-to-r shadow-lg rounded-2xl p-4 border border-white/20",
                  currentCTA.bgClass
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <currentCTA.icon className={cn("h-6 w-6", currentCTA.iconColor)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm leading-tight">
                        {currentCTA.text}
                      </p>
                      <p className="text-white/80 text-xs">
                        {currentCTA.subtext}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={scrollToForm}
                    size="sm"
                    className="bg-white text-primary hover:bg-white/90 font-semibold px-4 py-2"
                  >
                    Ir
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center mt-3 gap-1">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-2 h-1 rounded-full transition-all duration-300",
                        index === currentVariant 
                          ? "bg-white" 
                          : "bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="absolute -top-2 -right-2 w-8 h-8 bg-muted/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Glow Effect */}
              <div className={cn(
                "absolute inset-0 rounded-2xl blur-xl opacity-30 -z-10 bg-gradient-to-r",
                currentCTA.bgClass
              )} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Intent Popup (Desktop) */}
      <AnimatePresence>
        {!isDismissed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden"
            id="exit-intent-trigger"
          >
            {/* Exit intent functionality can be added here */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Hook para detectar exit intent (opcional)
export function useExitIntent(onExitIntent: () => void) {
  useEffect(() => {
    let isTriggered = false

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isTriggered) {
        isTriggered = true
        onExitIntent()
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [onExitIntent])
}