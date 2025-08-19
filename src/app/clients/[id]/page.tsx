'use client'

import { useClient } from '@/hooks/useClient'
import ClientDetails from '@/components/ClientDetails'
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

interface ClientPageProps {
  params: {
    id: string
  }
}

export default function ClientPage({ params }: ClientPageProps) {
  const { client, loading, error, refetch } = useClient(params.id)

  // Loading State
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="h-4 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="flex items-start space-x-6">
              <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-52"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="hidden lg:flex space-x-3">
                <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-56 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error || !client) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            
            <h3 className="text-red-800 font-semibold text-lg mb-2">
              Erro ao carregar cliente
            </h3>
            
            <p className="text-red-600 text-sm mb-6">
              {error || 'Cliente não encontrado ou você não tem permissão para visualizá-lo.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/clients"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar para Clientes</span>
              </Link>
              
              <button 
                onClick={refetch}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Tentar Novamente</span>
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-red-200">
              <p className="text-xs text-red-500">
                ID do Cliente: <code className="bg-red-100 px-1 rounded">{params.id}</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success State
  return (
    <div className="p-6">
      <ClientDetails client={client} />
    </div>
  )
}

// Metadata para SEO
export async function generateMetadata({ params }: ClientPageProps): Promise<Metadata> {
  return {
    title: `Cliente ${params.id} | Flymilhas`,
    description: 'Detalhes do cliente e gerenciamento de milhas'
  }
}