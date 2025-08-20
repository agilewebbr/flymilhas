'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Settings,
  ArrowRight,
  CheckCircle,
  Clock,
  Calendar
} from 'lucide-react'
import { motion } from 'framer-motion'
import * as gtag from '@/lib/gtag'

export function EvolutionSection() {
  const scrollToDemo = () => {
    const element = document.getElementById('demo')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const evolutions = [
    {
      icon: BarChart3,
      title: "De planilhas manuais → dashboard profissional",
      description: "Impressione clientes desde o primeiro encontro",
      status: "Pronto",
      statusColor: "bg-green-500",
      sprint: "Sprint 2"
    },
    {
      icon: Rocket,
      title: "De relatórios demorados → automação eficiente",
      description: "Gere relatórios em minutos como os grandes gestores",
      status: "Em desenvolvimento",
      statusColor: "bg-blue-500",
      sprint: "Sprint 3"
    },
    {
      icon: DollarSign,
      title: "De controle limitado → gestão financeira completa",
      description: "Tenha credibilidade total nas negociações",
      status: "Em desenvolvimento",
      statusColor: "bg-blue-500",
      sprint: "Sprint 3"
    },
    {
      icon: TrendingUp,
      title: "De operação limitada → escalabilidade ilimitada",
      description: "Cresça de 5 para 50+ clientes sem limitações",
      status: "Em desenvolvimento",
      statusColor: "bg-blue-500",
      sprint: "Sprint 3"
    },
    {
      icon: Star,
      title: "De gestão básica → autoridade reconhecida",
      description: "Construa credibilidade e seja respeitado no mercado",
      status: "Roadmap",
      statusColor: "bg-orange-500",
      sprint: "Sprint 4"
    },
    {
      icon: Settings,
      title: "De processos manuais → padrões de elite",
      description: "Trabalhe como os melhores gestores do Brasil",
      status: "Roadmap",
      statusColor: "bg-orange-500",
      sprint: "Sprint 4"
    }
  ]

  return (
    <section id="evolucao" className="py-16 lg:py-24 bg-background">
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
              <span className="text-foreground">Apresentamos o</span>
              <br />
              <span className="text-primary">FlyMilhas</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              A ferramenta que eleva seu patamar profissional
            </p>
            <p className="text-lg text-muted-foreground">
              A primeira plataforma criada especificamente para gestores que querem evoluir e ser reconhecidos como profissionais de elite no mercado.
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-6">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-lg font-medium text-primary">Lançamento Q2 2025</span>
            </div>
          </motion.div>
        </div>

        {/* Evolutions Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {evolutions.map((evolution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <evolution.icon className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground mb-2 text-lg leading-tight">
                            {evolution.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {evolution.description}
                          </p>
                        </div>
                        
                        <div className="ml-4 flex flex-col items-end gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`${evolution.statusColor} text-white text-xs`}
                          >
                            {evolution.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {evolution.sprint}
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Progresso</span>
                          <span className="text-sm font-medium text-primary">
                            {evolution.status === 'Pronto' ? '100%' : 
                             evolution.status === 'Em desenvolvimento' ? '60%' : '20%'}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                            style={{ 
                              width: evolution.status === 'Pronto' ? '100%' : 
                                     evolution.status === 'Em desenvolvimento' ? '60%' : '20%' 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Diferencial */}
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
                <CheckCircle className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Diferencial Evolutivo
                </h3>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Ao contrário das ferramentas básicas disponíveis, o FlyMilhas foi projetado para ser o catalisador da sua evolução profissional - de gestor com potencial para profissional de grande escala respeitado no mercado.
              </p>
              
              <Button
                onClick={() => {
                  gtag.trackCTAClick('Ver Minha Evolução', 'evolution_cta', 'evolution_section')
                  scrollToDemo()
                }}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold"
              >
                Ver Minha Evolução
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}