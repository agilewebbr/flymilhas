'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Monitor, 
  FileText, 
  Calculator, 
  Smartphone,
  ArrowRight,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import * as gtag from '@/lib/gtag'

export function DemoSection() {
  const scrollToForm = () => {
    const element = document.getElementById('candidatura')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const comparisons = [
    {
      icon: Monitor,
      title: "Dashboard: Básico → Profissional",
      before: "Múltiplas planilhas espalhadas e difíceis de acompanhar",
      after: "Dashboard profissional que impressiona qualquer cliente",
      status: "Versão Final",
      image: "dashboard"
    },
    {
      icon: FileText,
      title: "Relatórios: Manual → Automático",
      before: "Horas criando relatórios manuais com risco de erros",
      after: "Relatórios profissionais gerados em 30 segundos",
      status: "Sprint 3",
      image: "reports"
    },
    {
      icon: Calculator,
      title: "Controle: Limitado → Completo",
      before: "Controle básico que não transmite confiança",
      after: "Controle financeiro total com precisão profissional",
      status: "Sprint 3",
      image: "control"
    },
    {
      icon: TrendingUp,
      title: "Escala: Restrita → Ilimitada",
      before: "Operação limitada a poucos clientes por limitações técnicas",
      after: "Capacidade para 50+ clientes com facilidade",
      status: "Sprint 4",
      image: "scale"
    }
  ]

  return (
    <section id="demo" className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-foreground">Veja Sua</span>
              <br />
              <span className="text-primary">Evolução</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Do estágio atual para profissional de elite
            </p>
          </motion.div>
        </div>

        {/* Comparisons Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {comparisons.map((comparison, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <comparison.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">
                          {comparison.title}
                        </h3>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {comparison.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Visual Demo Area */}
                  <div className="px-6 pb-4">
                    <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-lg p-6 mb-4">
                      {/* Mock Interface */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="text-xs text-muted-foreground ml-2">
                            FlyMilhas {comparison.status}
                          </div>
                        </div>
                        
                        {/* Demo content based on type */}
                        {comparison.image === 'dashboard' && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Visão Geral</span>
                              <span className="text-xs text-primary">Elite Level</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-background/80 rounded p-3 text-center">
                                <div className="text-lg font-bold text-primary">127</div>
                                <div className="text-xs text-muted-foreground">Clientes</div>
                              </div>
                              <div className="bg-background/80 rounded p-3 text-center">
                                <div className="text-lg font-bold text-primary">R$ 1.8M</div>
                                <div className="text-xs text-muted-foreground">Milhas</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {comparison.image === 'reports' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-background/80 rounded p-2">
                              <span className="text-xs">Relatório Mensal</span>
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            </div>
                            <div className="flex items-center justify-between bg-background/80 rounded p-2">
                              <span className="text-xs">Análise de Performance</span>
                              <Clock className="h-3 w-3 text-blue-500" />
                            </div>
                            <div className="text-center text-xs text-primary font-medium">
                              Gerado em 30s
                            </div>
                          </div>
                        )}

                        {comparison.image === 'control' && (
                          <div className="space-y-2">
                            <div className="bg-background/80 rounded p-2">
                              <div className="text-xs text-muted-foreground">Custo Médio</div>
                              <div className="text-sm font-bold text-primary">R$ 28,50/mil</div>
                            </div>
                            <div className="bg-background/80 rounded p-2">
                              <div className="text-xs text-muted-foreground">Margem</div>
                              <div className="text-sm font-bold text-green-500">32.5%</div>
                            </div>
                          </div>
                        )}

                        {comparison.image === 'scale' && (
                          <div className="space-y-2">
                            <div className="bg-background/80 rounded p-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs">Capacidade Atual</span>
                                <span className="text-xs font-bold text-primary">67/200</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1 mt-1">
                                <div className="bg-primary h-1 rounded-full" style={{ width: '33%' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Before/After Comparison */}
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      {/* Before */}
                      <div className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg">
                        <div className="w-6 h-6 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-destructive text-xs font-bold">A</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground mb-1">ANTES:</div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {comparison.before}
                          </p>
                        </div>
                      </div>

                      {/* After */}
                      <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-primary text-xs font-bold">D</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground mb-1">DEPOIS:</div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {comparison.after}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Evolution Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Jornada de Evolução
                </h3>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Em 90 dias: De gestão básica com potencial limitado para profissional respeitado com processos de elite reconhecidos no mercado.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-left">
                  <h4 className="font-semibold text-foreground mb-2">📊 Hoje:</h4>
                  <p className="text-muted-foreground">
                    "É um gestor que faz um bom trabalho..."
                  </p>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-foreground mb-2">🚀 Em 90 dias:</h4>
                  <p className="text-primary font-medium">
                    "Esse é um profissional de elite, quero trabalhar com ele!"
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => {
                  gtag.trackCTAClick('Reservar Acesso Prioritário', 'demo_cta', 'demo_section')
                  scrollToForm()
                }}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold rounded-xl touch-manipulation"
              >
                Reservar Acesso Prioritário
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}