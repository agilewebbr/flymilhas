// src/app/clients/page.tsx - Substituir todo o conteúdo
'use client'

import { useState } from 'react'
import { useClients } from '@/hooks/useClients'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ClientCard } from '@/components/ClientCard'
import { CreateClientModal } from '@/components/CreateClientModal'
import { Search, Plus, Filter, Users } from 'lucide-react'
import Link from 'next/link'

// Import seguro do AppLayout (mesmo padrão do dashboard)
let AppLayout: any

try {
  const appLayoutModule = require('@/components/app-layout')
  AppLayout = appLayoutModule.AppLayout
} catch (e) {
  AppLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">{children}</div>
    </div>
  )
}

export default function ClientsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const {
    clients,
    loading,
    error,
    pagination,
    createClient,
    deleteClient,
    setQuery,
    refreshClients
  } = useClients()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery({ search: searchTerm, page: '1' })
  }

  const handleCreateClient = async (data: any) => {
    try {
      await createClient(data)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await deleteClient(id)
      } catch (error) {
        console.error('Erro ao deletar cliente:', error)
      }
    }
  }

  return (
    <ProtectedRoute allowedRoles={['gestor']}>
      <AppLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Meus Clientes
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie todos os seus clientes e suas contas de milhas
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Cliente</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar cliente por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filtrar</span>
              </button>
            </form>
          </div>

          {/* Conteúdo */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800 font-medium">Erro ao carregar clientes</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={refreshClients}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum cliente encontrado
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Comece adicionando seu primeiro cliente para gerenciar suas contas de milhas.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Primeiro Cliente</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Grid de Clientes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <Link key={client.id} href={`/clients/${client.id}`}>
                    <div className="cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-lg">
                      <ClientCard 
                        client={client} 
                        onDelete={() => deleteClient(client.id)} 
                      />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Paginação */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center">
                  <nav className="flex space-x-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setQuery({ page: page.toString() })}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pagination.page === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal de Criação */}
        <CreateClientModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateClient}
        />
      </AppLayout>
    </ProtectedRoute>
  )
}