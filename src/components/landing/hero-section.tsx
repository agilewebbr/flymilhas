'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, ArrowRight, Star, Users, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import * as gtag from '@/lib/gtag'

export function HeroSection() {
  const scrollToForm = () => {
    const element = document.getElementById('candidatura')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToEvolution = () => {
    const element = document.getElementById('evolucao')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Star className="h-4 w-4" />
              Apenas 100 vagas disponíveis
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6"
            >
              <span className="text-foreground">Pronto Para Ser</span>
              <br />
              <span className="text-primary">Reconhecido Como</span>
              <br />
              <span className="text-foreground">Profissional de Elite?</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-2xl"
            >
              Evolua para o próximo nível profissional. Torne-se o gestor respeitado que você sempre quis ser com processos padronizados, relatórios impressionantes e escalabilidade ilimitada.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8"
            >
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">Lançamento Q3 2025</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">100 vagas exclusivas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Evolução em 90 dias</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center lg:justify-start"
            >
              <Button
                onClick={() => {
                  gtag.trackCTAClick('Quero Me Tornar Um Profissional', 'hero_primary_cta', 'hero_section')
                  scrollToForm()
                }}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto px-8 py-4 md:py-6 text-base md:text-lg font-semibold rounded-xl touch-manipulation"
              >
                Quero Me Tornar Um Profissional
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                onClick={() => {
                  gtag.trackCTAClick('Ver Evolução', 'hero_secondary_cta', 'hero_section')
                  scrollToEvolution()
                }}
                variant="outline"
                size="lg"
                className="w-full md:w-auto px-8 py-3 md:py-6 text-base md:text-lg rounded-xl touch-manipulation"
              >
                Ver Evolução
              </Button>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Evolução garantida</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Preço founder</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Processos de elite</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Dashboard Preview */}
            <Card className="relative overflow-hidden bg-card border shadow-2xl">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
                  {/* Browser-like header */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="ml-4 text-sm text-muted-foreground">flymilhas.com.br</div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Dashboard Profissional</h3>
                      <div className="text-sm text-primary font-medium">Elite Level</div>
                    </div>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background/80 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary">247</div>
                        <div className="text-sm text-muted-foreground">Clientes Ativos</div>
                      </div>
                      <div className="bg-background/80 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary">R$ 2.3M</div>
                        <div className="text-sm text-muted-foreground">Milhas Gerenciadas</div>
                      </div>
                    </div>
                    
                    {/* Evolution Progress */}
                    <div className="bg-background/80 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Evolução Profissional</span>
                        <span className="text-sm text-primary">Elite</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-3 py-2 rounded-full text-sm font-medium shadow-lg"
            >
              Versão Elite
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-3 py-2 rounded-full text-sm font-medium shadow-lg"
            >
              Profissional
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}