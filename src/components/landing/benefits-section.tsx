'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Crown, 
  Target, 
  Rocket, 
  Zap, 
  Trophy, 
  DollarSign,
  ArrowRight,
  Star,
  TrendingUp,
  Users
} from 'lucide-react'
import { motion } from 'framer-motion'
import * as gtag from '@/lib/gtag'

export function BenefitsSection() {
  const scrollToForm = () => {
    const element = document.getElementById('candidatura')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const benefits = [
    {
      icon: Crown,
      title: "Seja reconhecido como PROFISSIONAL DE ELITE",
      description: "Clientes vão te procurar pela sua reputação de excelência e diferenciação no mercado",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: Target,
      title: "Tenha CREDIBILIDADE TOTAL nas negociações",
      description: "Dados precisos fazem você ser respeitado e valorizado como um verdadeiro especialista",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Rocket,
      title: "ESCALE sem limitações operacionais",
      description: "De poucos clientes para 50+ sem perder qualidade ou controle da operação",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Zap,
      title: "IMPRESSIONE clientes com profissionalismo elevado",
      description: "Relatórios que fazem clientes dizerem 'Nossa, que profissional diferenciado!'",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      icon: Trophy,
      title: "Construa AUTORIDADE reconhecida no mercado",
      description: "Torne-se referência e tenha outros gestores buscando suas dicas e orientações",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: DollarSign,
      title: "VALORIZE seus serviços com confiança",
      description: "Profissionais de elite cobram preços premium justificadamente por seu valor entregue",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
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
              <span className="text-foreground">Sua Evolução</span>
              <br />
              <span className="text-primary">Profissional</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Como você será reconhecido após 90 dias
            </p>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 ${benefit.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-lg text-foreground mb-3 leading-tight">
                      {benefit.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recognition Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-16"
        >
          <Card className="bg-gradient-to-r from-muted/50 to-primary/5 border-primary/20">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Seu Reconhecimento Após a Evolução
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Em 90 dias você será reconhecido como um dos gestores mais profissionais do mercado, com processos padronizados, relatórios impressionantes e credibilidade total estabelecida.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Today */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">📊 Hoje:</h4>
                  <p className="text-muted-foreground italic">
                    "É um gestor que faz um bom trabalho..."
                  </p>
                </div>

                {/* After Evolution */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">🚀 Em 90 dias:</h4>
                  <p className="text-primary font-medium italic">
                    "Esse é um profissional de elite, quero trabalhar com ele!"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">90</div>
              <div className="text-muted-foreground">Dias para Evolução</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100</div>
              <div className="text-muted-foreground">Vagas Exclusivas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">Q2</div>
              <div className="text-muted-foreground">Lançamento 2025</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
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
                  Pronto Para Sua Evolução?
                </h3>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Junte-se aos gestores que escolheram evoluir e conquistar o reconhecimento profissional que merecem no mercado.
              </p>
              
              <Button
                onClick={() => {
                  gtag.trackCTAClick('Começar Minha Evolução Profissional', 'benefits_cta', 'benefits_section')
                  scrollToForm()
                }}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold"
              >
                Começar Minha Evolução Profissional
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}