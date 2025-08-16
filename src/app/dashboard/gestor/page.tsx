'use client'

import { useAuth } from '@/components/AuthProvider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Users, BarChart3, Plane, CreditCard } from 'lucide-react'

export default function GestorDashboard() {
  const { profile, signOut } = useAuth()

  return (
    <ProtectedRoute allowedRoles={['gestor']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Plane className="h-8 w-8 text-brand-600" />
                <h1 className="ml-3 text-2xl font-bold text-gray-900">
                  FlyMilhas
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Olá, {profile?.name}
                </span>
                <button
                  onClick={signOut}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Welcome Message */}
            <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Dashboard do Gestor
                </h2>
                <p className="text-gray-600">
                  Bem-vindo ao FlyMilhas! Gerencie seus clientes e suas milhas de forma profissional.
                </p>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {/* Total Clientes */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Clientes
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          0
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Contas */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CreditCard className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Contas Ativas
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          0
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Milhas */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Plane className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Milhas
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          0
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transações do Mês */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Transações (Mês)
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          0
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Ações Rápidas
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors">
                    + Adicionar Cliente
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-md text-sm font-medium transition-colors">
                    Ver Todos os Clientes
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-md text-sm font-medium transition-colors">
                    Relatórios
                  </button>
                </div>
              </div>
            </div>

            {/* Status Sprint 1 */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    ✅
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}