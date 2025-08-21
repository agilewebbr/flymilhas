'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Wrench, 
  Cpu, 
  Smartphone, 
  Shield, 
  Zap, 
  Target,
  Phone,
  Gift,
  CheckCircle,
  ArrowRight,
  Star,
  Award
} from 'lucide-react'
import { motion } from 'framer-motion'
import * as gtag from '@/lib/gtag'

export function CredibilitySection() {
  const scrollToForm = () => {
    const element = document.getElementById('candidatura')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const credentials = [
    {
      icon: Wrench,
      title: "Criado por Profissionais Para Evoluir Profissionais",
      description: "Desenvolvido por quem entende o desejo de crescer profissionalmente e a frustração de não ter ferramentas à altura do seu potencial",
      highlight: "Experiência Real"
    },
    {
      icon: Target,
      title: "Foco Total na Sua Evolução Profissional",
      description: "Não é só uma ferramenta, é um sistema completo de evolução que eleva sua imagem e reconhecimento no mercado",
      highlight: "Propósito Claro"
    },
    {
      icon: Smartphone,
      title: "Tecnologia de Elite Para Impressionar",
      description: "Interface moderna que faz clientes pensarem 'Uau, esse profissional é realmente diferenciado'",
      highlight: "Design Premium"
    }
  ]

  const commitments = [
    {
      icon: CheckCircle,
      title: "Evolução garantida",
      description: "Ou devolvemos seu investimento"
    },
    {
      icon: Zap,
      title: "Resultados em 90 dias",
      description: "Veja sua transformação acontecer rapidamente"
    },
    {
      icon: Target,
      title: "Suporte total",
      description: "Nossa equipe te acompanha na jornada"
    },
    {
      icon: Phone,
      title: "Mentoria brasileira",
      description: "Especialistas que falam sua língua"
    }
  ]

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
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
              <span className="text-foreground">Seja</span>
              <br />
              <span className="text-primary">Pioneiro</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              A primeira ferramenta de evolução profissional em gestão de milhas
            </p>
          </motion.div>
        </div>

        {/* Credentials */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {credentials.map((credential, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <credential.icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                      {credential.highlight}
                    </Badge>
                    
                    <h3 className="font-bold text-lg text-foreground mb-3 leading-tight">
                      {credential.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {credential.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Commitments */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Compromisso Com Sua Evolução
                </h3>
                <p className="text-lg text-muted-foreground">
                  Garantias que demonstram nossa confiança no processo de evolução
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {commitments.map((commitment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <commitment.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {commitment.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {commitment.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pioneer Opportunity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <Gift className="h-8 w-8 text-yellow-600 mr-3" />
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Oportunidade Histórica de Pioneirismo
                  </h3>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Você tem a chance única de ser um dos primeiros gestores do Brasil a evoluir para o próximo nível profissional usando a tecnologia mais avançada do mercado
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Exclusividade</h4>
                    <p className="text-sm text-muted-foreground">Primeiros 100 gestores</p>
                  </div>
                  <div className="text-center">
                    <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Reconhecimento</h4>
                    <p className="text-sm text-muted-foreground">Status de pioneiro</p>
                  </div>
                  <div className="text-center">
                    <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Vantagem</h4>
                    <p className="text-sm text-muted-foreground">Competitiva no mercado</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Final CTA */}
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
                <Shield className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Garantia de Evolução Pioneira
                </h3>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Seja um dos primeiros 100 gestores a fazer essa evolução. Sua vantagem competitiva começa agora.
              </p>
              
              <div className="bg-background/80 rounded-lg p-6 mb-8">
                <p className="text-foreground font-medium">
                  "Esta é a única chance de fazer parte da primeira turma de gestores que evoluíram para profissionais de elite."
                </p>
              </div>
              
              <Button
                onClick={() => {
                  gtag.trackCTAClick('Quero Ser Pioneiro', 'credibility_cta', 'credibility_section')
                  scrollToForm()
                }}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 md:px-8 py-4 md:py-6 text-base font-semibold rounded-xl touch-manipulation"
              >
                Quero Ser Pioneiro
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}