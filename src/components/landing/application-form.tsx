'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Crown, 
  Star, 
  Shield, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  Gift,
  Target,
  Users,
  Award,
  Zap,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { leadsService, type CreateLeadData } from '@/services/leads.service'
import type { Lead } from '@/lib/supabase'

// Esquema de validação com Zod
const applicationFormSchema = z.object({
  nomeCompleto: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z
    .string()
    .email('Email inválido')
    .min(5, 'Email obrigatório'),
  whatsapp: z
    .string()
    .min(10, 'WhatsApp deve ter pelo menos 10 dígitos')
    .regex(/^[\d\s\(\)\+\-]+$/, 'Formato de WhatsApp inválido'),
  tempoMilhas: z
    .string()
    .min(1, 'Selecione há quanto tempo trabalha com milhas'),
  quantidadeClientes: z
    .string()
    .min(1, 'Selecione quantos clientes gerencia'),
  objetivoProfissional: z
    .string()
    .min(1, 'Selecione seu maior objetivo profissional'),
  desafioAtual: z
    .string()
    .min(1, 'Selecione seu principal desafio atual'),
  inicioEvolucao: z
    .string()
    .min(1, 'Selecione quando quer começar sua evolução')
})

type ApplicationFormData = z.infer<typeof applicationFormSchema>

// Opções dos dropdowns
const tempoMilhasOptions = [
  { value: 'iniciando', label: 'Iniciando agora' },
  { value: '3-6m', label: '3-6 meses' },
  { value: '6-12m', label: '6-12 meses' },
  { value: '1-2a', label: '1-2 anos' },
  { value: '2+a', label: '2+ anos' }
]

const quantidadeClientesOptions = [
  { value: '0', label: '0 (quero começar)' },
  { value: '1-3', label: '1-3 clientes' },
  { value: '4-7', label: '4-7 clientes' },
  { value: '8-15', label: '8-15 clientes' },
  { value: '15+', label: '15+ clientes' }
]

const objetivoProfissionalOptions = [
  { value: 'reconhecimento', label: 'Ser reconhecido como profissional' },
  { value: '50-clientes', label: 'Gerenciar 50+ clientes' },
  { value: 'credibilidade', label: 'Ter credibilidade total' },
  { value: 'valorizar', label: 'Valorizar meus serviços' },
  { value: 'referencia', label: 'Ser referência no mercado' }
]

const desafioAtualOptions = [
  { value: 'ferramentas', label: 'Ferramentas limitadas' },
  { value: 'planilhas', label: 'Planilhas manuais' },
  { value: 'credibilidade', label: 'Falta de credibilidade' },
  { value: 'escalar', label: 'Dificuldade para escalar' },
  { value: 'relatorios', label: 'Relatórios demorados' }
]

const inicioEvolucaoOptions = [
  { value: 'imediato', label: 'Imediatamente' },
  { value: 'q2-2025', label: 'Q2 2025 (no lançamento)' },
  { value: 'q3-2025', label: 'Q3 2025' },
  { value: 'nao-sei', label: 'Ainda não sei' }
]

export function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leadData, setLeadData] = useState<Lead | null>(null)
  const [hasStartedForm, setHasStartedForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema)
  })

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    
    try {
      // Usar o service para salvar no Supabase
      const result = await leadsService.createLead({
        nomeCompleto: data.nomeCompleto,
        email: data.email,
        whatsapp: data.whatsapp,
        tempoMilhas: data.tempoMilhas,
        quantidadeClientes: data.quantidadeClientes,
        objetivoProfissional: data.objetivoProfissional,
        desafioAtual: data.desafioAtual,
        inicioEvolucao: data.inicioEvolucao
      })

      if (result.success) {
        setIsSubmitted(true)
        setLeadData(result.data || null)
        reset()
        
        // 🎯 TRACKING DE CONVERSÃO SIMPLES
        // Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'lead_generation', {
            'event_category': 'conversion',
            'event_label': 'evolution_application',
            'value': result.score || 50,
            'lead_score': result.score,
            'tempo_milhas': data.tempoMilhas,
            'quantidade_clientes': data.quantidadeClientes
          })
        }

        // Facebook Pixel
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead', {
            content_name: 'FlyMilhas Evolution Application',
            content_category: 'lead_generation',
            value: result.score || 50,
            currency: 'BRL'
          })
        }

        // Track conversão específica do Google Ads (se configurado)
        const googleAdsConversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID
        if (googleAdsConversionId && typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            'send_to': googleAdsConversionId,
            'value': result.score || 50,
            'currency': 'BRL'
          })
        }
      } else {
        setError(result.error || 'Erro ao enviar candidatura')
        
        // Track erro para análise
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'form_error', {
            'event_category': 'form_interaction',
            'event_label': result.error || 'unknown_error'
          })
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro inesperado:', error)
      }
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
      
      // Track erro de conexão
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'form_connection_error', {
          'event_category': 'technical_error',
          'event_label': 'connection_failed'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para tracking do início do formulário
  const handleFormStart = () => {
    if (!hasStartedForm) {
      setHasStartedForm(true)
      
      // Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'form_start', {
          'event_category': 'form_interaction',
          'event_label': 'evolution_application_start'
        })
      }

      // Facebook Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_name: 'Evolution Application Form',
          content_category: 'form_interaction'
        })
      }
    }
    setError(null)
  }

  const beneficiosCandidatura = [
    {
      icon: Crown,
      title: "Vaga garantida",
      description: "na primeira turma de evolução profissional"
    },
    {
      icon: Gift,
      title: "Preço founder vitalício",
      description: "50% OFF permanente"
    },
    {
      icon: Award,
      title: "Status de pioneiro",
      description: "Reconhecimento como fundador"
    },
    {
      icon: Target,
      title: "Mentoria exclusiva",
      description: "Segredos dos gestores de elite"
    },
    {
      icon: Zap,
      title: "Evolução garantida",
      description: "Profissional de elite em 90 dias"
    }
  ]

  if (isSubmitted) {
    return (
      <section id="candidatura" className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-8 lg:p-12">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  🎉 Candidatura Enviada com Sucesso!
                </h2>
                
                <p className="text-lg text-muted-foreground mb-6">
                  Você está agora na lista dos 500 candidatos à evolução profissional.
                  {leadData?.score && (
                    <span className="block mt-2 text-primary font-semibold">
                      Score de Qualificação: {leadData.score}/100 pontos
                    </span>
                  )}
                </p>
                
                <div className="bg-background/80 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-foreground mb-4">📧 Próximos Passos:</h3>
                  <ul className="text-left text-muted-foreground space-y-2">
                    <li>✅ Confirmação por email em até 24h</li>
                    <li>✅ Convite para grupo exclusivo de pioneiros</li>
                    <li>✅ Acesso ao roadmap de desenvolvimento</li>
                    <li>✅ Notificação do lançamento em Q2 2025</li>
                  </ul>
                </div>
                
                <Badge className="bg-primary text-primary-foreground">
                  Status: Candidato à Evolução Profissional 👑
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="candidatura" className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-foreground">Candidate-se à</span>
              <br />
              <span className="text-primary">Evolução</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Torne-se um dos 500 profissionais de elite
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card>
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Formulário de Candidatura
                  </h3>
                  <p className="text-muted-foreground">
                    Preencha os dados abaixo para se candidatar à primeira turma de evolução profissional.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Nome Completo */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nome completo *
                    </label>
                    <input
                      {...register('nomeCompleto')}
                      type="text"
                      onFocus={handleFormStart}
                      className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Seu nome completo"
                    />
                    {errors.nomeCompleto && (
                      <p className="text-destructive text-sm mt-1">{errors.nomeCompleto.message}</p>
                    )}
                  </div>

                  {/* Email e WhatsApp */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email profissional *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        onFocus={handleFormStart}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="seu@email.com"
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        WhatsApp *
                      </label>
                      <input
                        {...register('whatsapp')}
                        type="tel"
                        onFocus={handleFormStart}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="(11) 99999-9999"
                      />
                      {errors.whatsapp && (
                        <p className="text-destructive text-sm mt-1">{errors.whatsapp.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Tempo com Milhas */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Há quanto tempo trabalha com milhas? *
                    </label>
                    <select
                      {...register('tempoMilhas')}
                      className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Selecione uma opção</option>
                      {tempoMilhasOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.tempoMilhas && (
                      <p className="text-destructive text-sm mt-1">{errors.tempoMilhas.message}</p>
                    )}
                  </div>

                  {/* Quantidade de Clientes */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quantos clientes você gerencia atualmente? *
                    </label>
                    <select
                      {...register('quantidadeClientes')}
                      className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Selecione uma opção</option>
                      {quantidadeClientesOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.quantidadeClientes && (
                      <p className="text-destructive text-sm mt-1">{errors.quantidadeClientes.message}</p>
                    )}
                  </div>

                  {/* Objetivo Profissional */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Qual seu maior objetivo profissional? *
                    </label>
                    <select
                      {...register('objetivoProfissional')}
                      className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Selecione uma opção</option>
                      {objetivoProfissionalOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.objetivoProfissional && (
                      <p className="text-destructive text-sm mt-1">{errors.objetivoProfissional.message}</p>
                    )}
                  </div>

                  {/* Desafio Atual */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Principal desafio atual? *
                    </label>
                    <select
                      {...register('desafioAtual')}
                      className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Selecione uma opção</option>
                      {desafioAtualOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.desafioAtual && (
                      <p className="text-destructive text-sm mt-1">{errors.desafioAtual.message}</p>
                    )}
                  </div>

                  {/* Início da Evolução */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quando quer começar sua evolução? *
                    </label>
                    <select
                      {...register('inicioEvolucao')}
                      className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Selecione uma opção</option>
                      {inicioEvolucaoOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.inicioEvolucao && (
                      <p className="text-destructive text-sm mt-1">{errors.inicioEvolucao.message}</p>
                    )}
                  </div>

                  {/* Mensagem de Erro */}
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-destructive mb-1">Erro ao enviar candidatura</h4>
                          <p className="text-sm text-destructive/80">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botão de Envio */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando Candidatura...
                        </>
                      ) : (
                        <>
                          Quero Evoluir Para Profissional de Elite
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefícios da Candidatura */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Benefícios da Candidatura
                </h3>
                
                <div className="space-y-4">
                  {beneficiosCandidatura.map((beneficio, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <beneficio.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">
                          {beneficio.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {beneficio.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Segurança */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Dados Protegidos
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>🔒 Dados protegidos e seguros</p>
                  <p>👑 Apenas 500 selecionados</p>
                  <p>🚀 Evolução garantida em 90 dias</p>
                </div>
              </CardContent>
            </Card>

            {/* Chamada Final */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground italic">
                  "Seja um dos primeiros gestores do Brasil a evoluir para profissional de elite reconhecido no mercado"
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}