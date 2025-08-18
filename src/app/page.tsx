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
    console.log('Landing page effect - loading:', loading, 'user:', user?.id, 'profile:', profile?.name, 'role:', profile?.role)
    
    if (!loading && user && profile) {
      console.log('Redirecting user with role:', profile.role)
      
      // Redirect authenticated users to their dashboard
      if (profile.role === 'admin') {
        console.log('Redirecting to admin dashboard')
        router.push('/admin/dashboard')
      } else if (profile.role === 'gestor') {
        console.log('Redirecting to gestor dashboard')
        router.push('/dashboard/gestor')
      } else {
        console.log('Redirecting to cliente dashboard')
        router.push('/dashboard/cliente')
      }
    }
  }, [user, profile, loading, router])

  console.log('Landing page render - loading:', loading, 'user:', user?.id, 'profile:', profile?.name)

  if (loading) {
    console.log('Showing loading spinner')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
        <div className="ml-4 text-gray-600">Carregando...</div>
      </div>
    )
  }

  // Se está logado mas não redirecionou ainda, força o redirecionamento
  if (user && profile) {
    console.log('User is logged in, forcing redirect to dashboard')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando para o dashboard...</p>
        </div>
      </div>
    )
  }

  console.log('Showing landing page')

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

      {/* Resto do conteúdo da landing page... */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Sprint 2 em Desenvolvimento</h2>
          <p className="mt-2 text-gray-600">Interface de clientes implementada com sucesso!</p>
        </div>
      </section>
    </div>
  )
}