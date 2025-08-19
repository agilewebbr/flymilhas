'use client'

import { useState } from 'react'
import { useClients } from '@/hooks/useClients'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ClientCard } from '@/components/ClientCard'
import { CreateClientModal } from '@/components/CreateClientModal'
import { Search, Plus, Filter, Users } from 'lucide-react'
import Link from 'next/link'

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
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/dashboard/gestor" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Clientes</span>
      </nav>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-brand-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Meus Clientes
                  </h1>
                  <p className="text-sm text-gray-600">
                    Gerencie todos os seus clientes e suas contas de milhas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Novo Cliente
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar cliente por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filtrar
              </button>
            </form>
          </div>

          {/* Lista de Clientes */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
              <button
                onClick={refreshClients}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum cliente encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece adicionando seu primeiro cliente.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md"
                >
                  Adicionar Cliente
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <Link key={client.id} href={`/clients/${client.id}`}>
                    <div className="cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-lg">
                      <ClientCard client={client} />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Paginação */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <nav className="flex space-x-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setQuery({ page: page.toString() })}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          pagination.page === page
                            ? 'bg-brand-600 text-white'
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
      </div>
    </ProtectedRoute>
  )
}