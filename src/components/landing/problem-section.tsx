'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, TrendingDown, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function ProblemSection() {
  const scrollToForm = () => {
    const element = document.getElementById('candidatura')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const problems = [
    {
      icon: TrendingDown,
      title: "Métodos básicos que limitam seu crescimento",
      description: "Ferramentas que não demonstram o profissionalismo que você tem"
    },
    {
      icon: Clock,
      title: "Planilhas manuais demoradas",
      description: "Processo que não reflete sua competência real no mercado"
    },
    {
      icon: AlertTriangle,
      title: "Falta de processos padronizados",
      description: "Diferentes dos métodos que os grandes gestores estabelecidos usam"
    },
    {
      icon: TrendingDown,
      title: "Relatórios que consomem tempo",
      description: "Não impressionam clientes como deveriam impressionar"
    },
    {
      icon: X,
      title: "Controle financeiro limitado",
      description: "Que não reflete sua competência e conhecimento real"
    },
    {
      icon: AlertTriangle,
      title: "Dificuldade para escalar",
      description: "Você tem potencial para muito mais clientes do que consegue gerenciar"
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
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-foreground">Pronto Para o</span>
              <br />
              <span className="text-primary">Próximo Nível?</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Reconhece essas limitações do seu potencial?
            </p>
          </motion.div>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                      <X className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2 leading-tight">
                        {problem.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Emotional Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8 lg:p-12">
              <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">
                Você tem todo o conhecimento e competência para ser um grande gestor profissional...
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Mas as ferramentas atuais limitam sua capacidade de demonstrar e escalar seu verdadeiro potencial no mercado.
              </p>
              
              <div className="bg-background/80 rounded-lg p-6 mb-8">
                <p className="text-lg font-medium text-foreground mb-4">
                  Enquanto outros gestores evoluem com ferramentas profissionais e ganham reconhecimento no mercado...
                </p>
                <p className="text-muted-foreground">
                  Você ainda está usando métodos que não refletem sua competência real e limitam seu crescimento profissional.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-primary">
                  Chegou a hora de ter ferramentas à altura do seu potencial
                </h4>
                <p className="text-muted-foreground mb-8">
                  E conquistar o reconhecimento profissional que você merece no mercado.
                </p>
                
                <Button
                  onClick={scrollToForm}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold"
                >
                  Quero Evoluir Profissionalmente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}