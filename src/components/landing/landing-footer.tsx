'use client'

import Link from 'next/link'
import { 
  Plane, 
  Shield, 
  Phone, 
  Rocket, 
  Mail, 
  MapPin,
  Calendar,
  Users,
  Award,
  ExternalLink
} from 'lucide-react'
import { motion } from 'framer-motion'
import * as gtag from '@/lib/gtag'

export function LandingFooter() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const currentYear = new Date().getFullYear()

  const produtoLinks = [
    { 
      label: 'Funcionalidades', 
      action: () => scrollToSection('evolucao'),
      description: 'Veja todas as features'
    },
    { 
      label: 'Demonstração', 
      action: () => scrollToSection('demo'),
      description: 'Como funciona na prática'
    },
    { 
      label: 'Roadmap', 
      href: '#roadmap',
      description: 'O que está por vir'
    },
    { 
      label: 'Preços', 
      action: () => scrollToSection('candidatura'),
      description: 'Planos e investimento'
    }
  ]

  const evolucaoLinks = [
    { 
      label: 'Por que evoluir?', 
      action: () => scrollToSection('problem'),
      description: 'Limitações atuais'
    },
    { 
      label: 'Jornada de 90 dias', 
      action: () => scrollToSection('demo'),
      description: 'Seu processo de evolução'
    },
    { 
      label: 'Benefícios', 
      action: () => scrollToSection('benefits'),
      description: 'O que você ganha'
    },
    { 
      label: 'Candidatar-se', 
      action: () => scrollToSection('candidatura'),
      description: 'Garanta sua vaga'
    }
  ]

  const suporteLinks = [
    { 
      label: 'FAQ', 
      href: '#faq',
      description: 'Perguntas frequentes'
    },
    { 
      label: 'Contato', 
      href: 'mailto:contato@flymilhas.com.br',
      icon: Mail,
      description: 'Fale conosco'
    },
    { 
      label: 'WhatsApp', 
      href: 'https://wa.me/5511999999999',
      icon: Phone,
      description: 'Suporte direto'
    },
    { 
      label: 'Termos de Uso', 
      href: '/termos',
      description: 'Políticas e termos'
    },
    { 
      label: 'Privacidade', 
      href: '/privacidade',
      description: 'Como tratamos seus dados'
    }
  ]

  const trustSignals = [
    {
      icon: Shield,
      text: "Dados seguros",
      description: "Criptografia e proteção total"
    },
    {
      icon: Phone,
      text: "Suporte brasileiro",
      description: "Atendimento em português"
    },
    {
      icon: Rocket,
      text: "Pioneiro",
      description: "Primeira solução do Brasil"
    }
  ]

  const stats = [
    {
      icon: Users,
      number: "100",
      label: "Vagas Pioneiras"
    },
    {
      icon: Calendar,
      number: "Q2",
      label: "Lançamento 2025"
    },
    {
      icon: Award,
      number: "90",
      label: "Dias para Evolução"
    }
  ]

  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              {/* Logo */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Plane className="text-primary-foreground h-5 w-5" />
                </div>
                <span className="font-bold text-2xl text-foreground">FlyMilhas</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                A primeira plataforma profissional de gestão de milhas do Brasil. 
                Desenvolvida especificamente para gestores que querem evoluir e ser 
                reconhecidos como profissionais de elite.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:contato@flymilhas.com.br" className="hover:text-foreground transition-colors">
                    contato@flymilhas.com.br
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href="https://wa.me/5511999999999" className="hover:text-foreground transition-colors">
                    (11) 99999-9999
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>São Paulo, Brasil</span>
                </div>
              </div>
            </motion.div>

            {/* Product Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-foreground text-lg mb-6">Produto</h3>
              <ul className="space-y-4">
                {produtoLinks.map((link, index) => (
                  <li key={index}>
                    {link.href ? (
                      <Link
                        href={link.href}
                        className="group block hover:text-primary transition-colors"
                      >
                        <div className="font-medium">{link.label}</div>
                        <div className="text-sm text-muted-foreground group-hover:text-primary/80">
                          {link.description}
                        </div>
                      </Link>
                    ) : (
                      <button
                        onClick={link.action}
                        className="group block text-left hover:text-primary transition-colors"
                      >
                        <div className="font-medium">{link.label}</div>
                        <div className="text-sm text-muted-foreground group-hover:text-primary/80">
                          {link.description}
                        </div>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Evolution Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-foreground text-lg mb-6">Evolução</h3>
              <ul className="space-y-4">
                {evolucaoLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={link.action}
                      className="group block text-left hover:text-primary transition-colors"
                    >
                      <div className="font-medium">{link.label}</div>
                      <div className="text-sm text-muted-foreground group-hover:text-primary/80">
                        {link.description}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-foreground text-lg mb-6">Suporte</h3>
              <ul className="space-y-4">
                {suporteLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {link.icon && <link.icon className="h-4 w-4" />}
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {link.label}
                          {link.href.startsWith('http') && (
                            <ExternalLink className="h-3 w-3" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground group-hover:text-primary/80">
                          {link.description}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-border"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-border"
        >
          <div className="flex flex-wrap justify-center gap-8">
            {trustSignals.map((signal, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <signal.icon className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-foreground">{signal.text}</div>
                  <div className="text-muted-foreground">{signal.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-6 border-t border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} FlyMilhas. Todos os direitos reservados.
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/termos" className="hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="hover:text-foreground transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/cookies" className="hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-border"
        >
          <div className="text-center bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Pronto para sua evolução profissional?
            </h3>
            <p className="text-muted-foreground mb-6">
              Junte-se aos primeiros 100 gestores selecionados para a primeira turma de elite.
            </p>
            <button
              onClick={() => {
                gtag.trackCTAClick('Candidatar-se Agora', 'footer_cta', 'footer_section')
                scrollToSection('candidatura')
              }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Candidatar-se Agora
              <Rocket className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}