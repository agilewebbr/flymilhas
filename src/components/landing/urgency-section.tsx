'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  Users, 
  Crown, 
  Zap, 
  Calendar, 
  Target,
  Star,
  ArrowRight,
  Gift,
  Shield,
  TrendingUp,
  Award,
  Settings
} from 'lucide-react'
import { motion } from 'framer-motion'
import * as gtag from '@/lib/gtag'

export function UrgencySection() {
  const scrollToForm = () => {
    const element = document.getElementById('candidatura')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const exclusiveBenefits = [
    {
      icon: Zap,
      title: "Acesso prioritário à evolução",
      description: "Seja um dos primeiros profissionais de elite"
    },
    {
      icon: Crown,
      title: "Preço founder permanente",
      description: "50% OFF que nunca expira para quem acreditou primeiro"
    },
    {
      icon: Target,
      title: "Mentoria exclusiva de evolução",
      description: "Aprenda os segredos dos gestores de elite"
    },
    {
      icon: Award,
      title: "Status de Founder",
      description: "Reconhecimento como pioneiro da evolução profissional"
    },
    {
      icon: Settings,
      title: "Influência no desenvolvimento",
      description: "Ajude a construir a ferramenta perfeita para evolução"
    }
  ]

  return (
    <section className="py-16 lg:py-24 bg-background">
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
              <span className="text-foreground">Oportunidade</span>
              <br />
              <span className="text-primary">Única</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Seja um dos primeiros 100 a evoluir para profissional de elite
            </p>
          </motion.div>
        </div>

        {/* Main Offer Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 max-w-4xl mx-auto">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-6">
                  <Crown className="h-10 w-10 text-primary mr-3" />
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Evolução Founder
                  </h3>
                </div>
                
                <div className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-full text-lg font-bold mb-6">
                  <Gift className="h-6 w-6" />
                  Preço de Fundador: 50% OFF para sempre
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Garanta sua evolução profissional com condições que nunca mais voltarão
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">100</div>
                  <div className="text-sm text-muted-foreground">Vagas Pioneiras</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">Q2</div>
                  <div className="text-sm text-muted-foreground">Lançamento 2025</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">90</div>
                  <div className="text-sm text-muted-foreground">Dias Evolução</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Exclusive Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {exclusiveBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 leading-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Scarcity Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800 max-w-4xl mx-auto">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-orange-600 mr-3" />
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Escassez Real
                  </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 mb-2">
                      Limitado
                    </Badge>
                    <p className="font-semibold text-foreground">Apenas 100 vagas para evolução pioneira</p>
                    <p className="text-sm text-muted-foreground">Qualidade acima de quantidade</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-2">
                      Cronograma
                    </Badge>
                    <p className="font-semibold text-foreground">Evolução começa em Q2 2025</p>
                    <p className="text-sm text-muted-foreground">Timeline transparente</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 mb-2">
                      Preço
                    </Badge>
                    <p className="font-semibold text-foreground">Depois dos 100, preços dobram</p>
                    <p className="text-sm text-muted-foreground">Vantagem de pioneiro</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 max-w-4xl mx-auto">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Garantias de Evolução
                  </h3>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Evolução garantida</h4>
                  <p className="text-sm text-muted-foreground">Torne-se profissional de elite ou dinheiro de volta</p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Resultados em 90 dias</h4>
                  <p className="text-sm text-muted-foreground">Mudança visível no reconhecimento do mercado</p>
                </div>
                <div className="text-center">
                  <Crown className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Status founder vitalício</h4>
                  <p className="text-sm text-muted-foreground">Reconhecimento permanente como pioneiro</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Final Urgency */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 max-w-3xl mx-auto">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Urgência Real
                </h3>
              </div>
              
              <div className="bg-background/80 rounded-lg p-6 mb-8">
                <p className="text-lg font-medium text-foreground italic">
                  "Esta é a única chance de fazer parte da primeira turma de gestores que evoluíram para profissionais de elite. Depois do lançamento, essa oportunidade não existe mais."
                </p>
              </div>
              
              <Button
                onClick={() => {
                  gtag.trackCTAClick('Garantir Minha Evolução Agora', 'urgency_cta', 'urgency_section')
                  scrollToForm()
                }}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold"
              >
                Garantir Minha Evolução Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}