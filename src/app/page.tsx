'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Plane, Users, BarChart3, Shield, ArrowRight, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && profile) {
      // Redirect authenticated users to their dashboard
      if (profile.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (profile.role === 'gestor') {
        router.push('/dashboard/gestor')
      } else {
        router.push('/dashboard/cliente')
      }
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <div className="flex items-center">
                <Plane className="h-8 w-8 text-brand-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">FlyMilhas</span>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
              <Link
                href="/login"
                className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="btn-primary"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Gestão profissional</span>{' '}
                  <span className="block text-brand-600 xl:inline">de milhas aéreas</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Plataforma completa para gestores de milhas gerenciarem múltiplos clientes e programas de fidelidade. 
                  Controle total, relatórios detalhados e crescimento do seu negócio.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 md:py-4 md:text-lg md:px-10"
                    >
                      Começar gratuitamente
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-700 bg-brand-100 hover:bg-brand-200 md:py-4 md:text-lg md:px-10"
                    >
                      Fazer login
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-brand-400 to-brand-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <Plane className="h-24 w-24 mx-auto mb-4 opacity-80" />
              <p className="text-xl font-semibold">Decolando com seus negócios</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-brand-600 font-semibold tracking-wide uppercase">Funcionalidades</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Tudo que você precisa para gerenciar milhas
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Uma plataforma completa desenvolvida especificamente para gestores profissionais de milhas aéreas.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-500 text-white">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Gestão de Clientes</h3>
                  </div>
                </div>
                <div className="mt-2 ml-16">
                  <p className="text-base text-gray-500">
                    Organize todos os seus clientes em um só lugar. Cadastre dados, notas e acompanhe o histórico completo.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-500 text-white">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Múltiplos Programas</h3>
                  </div>
                </div>
                <div className="mt-2 ml-16">
                  <p className="text-base text-gray-500">
                    Suporte completo para Smiles, LATAM Pass, Azul, Livelo, Esfera e outros programas de fidelidade.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-500 text-white">
                      <Shield className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Controle de Transações</h3>
                  </div>
                </div>
                <div className="mt-2 ml-16">
                  <p className="text-base text-gray-500">
                    Registre acúmulos e resgates com atualizações automáticas de saldo. Histórico completo e filtros avançados.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-500 text-white">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Relatórios e Métricas</h3>
                  </div>
                </div>
                <div className="mt-2 ml-16">
                  <p className="text-base text-gray-500">
                    Dashboards intuitivos com gráficos de evolução, KPIs do negócio e insights para crescimento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Por que escolher o FlyMilhas?</h2>
            <p className="mt-4 text-lg text-gray-500">
              Desenvolvido por especialistas para especialistas em milhas aéreas
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Interface intuitiva e fácil de usar',
              'Segurança e privacidade dos dados',
              'Suporte técnico especializado',
              'Atualizações constantes',
              'Dashboard personalizado por perfil',
              'Controle total de permissões',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <p className="ml-3 text-base text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Pronto para decolar?</span>
            <span className="block">Comece hoje mesmo.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-brand-200">
            Junte-se aos gestores que já estão revolucionando seus negócios de milhas.
          </p>
          <Link
            href="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-brand-600 bg-white hover:bg-brand-50 sm:w-auto"
          >
            Criar conta gratuita
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <div className="flex items-center">
              <Plane className="h-6 w-6 text-brand-600" />
              <span className="ml-2 text-sm font-medium text-gray-500">FlyMilhas</span>
            </div>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 FlyMilhas. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}