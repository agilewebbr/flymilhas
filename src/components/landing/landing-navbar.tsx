'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plane, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as gtag from '@/lib/gtag'

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
      isScrolled 
        ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Plane className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="font-semibold text-xl text-foreground">FlyMilhas</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('produto')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Produto
            </button>
            <button
              onClick={() => scrollToSection('evolucao')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Evolução
            </button>
            <button
              onClick={() => scrollToSection('candidatura')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Candidatura
            </button>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard/gestor">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Button 
              onClick={() => scrollToSection('candidatura')}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Candidatar-se
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-11 h-11 p-2 touch-manipulation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <div 
              className="fixed inset-0 z-[105] bg-black/20 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            <div className="md:hidden fixed top-16 left-0 right-0 z-[110] bg-background border-t border-border shadow-xl">
              <div className="px-4 py-6 space-y-3 bg-background border-t border-border">
                <button
                  onClick={() => scrollToSection('produto')}
                  className="block px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full text-left touch-manipulation rounded-lg min-h-[48px] flex items-center"
                >
                  Produto
                </button>
                <button
                  onClick={() => scrollToSection('evolucao')}
                  className="block px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full text-left touch-manipulation rounded-lg min-h-[48px] flex items-center"
                >
                  Evolução
                </button>
                <button
                  onClick={() => scrollToSection('candidatura')}
                  className="block px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full text-left touch-manipulation rounded-lg min-h-[48px] flex items-center"
                >
                  Candidatura
                </button>
                
                <div className="pt-6 pb-2 space-y-3 border-t border-border">
                  <Link href="/dashboard/gestor" className="block">
                    <Button variant="ghost" className="w-full h-12 text-base font-medium">
                      Entrar
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => scrollToSection('candidatura')}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold"
                  >
                    Candidatar-se
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}