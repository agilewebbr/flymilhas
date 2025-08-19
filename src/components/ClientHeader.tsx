import { Client } from '@/lib/database.types'
import { Mail, Phone, Calendar, ArrowLeft, Edit, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

interface ClientHeaderProps {
  client: Client
}

export default function ClientHeader({ client }: ClientHeaderProps) {
  // Gerar avatar com iniciais
  const initials = client.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Formatar data de criação
  const createdDate = new Date(client.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/dashboard/gestor" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/clients" className="hover:text-blue-600 transition-colors">
          Clientes
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{client.name}</span>
      </nav>

      {/* Botão Voltar */}
      <Link 
        href="/clients" 
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Voltar para Clientes</span>
      </Link>

      {/* Header Principal */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
        {/* Lado Esquerdo: Avatar + Info */}
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>

          {/* Informações */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 break-words">{client.name}</h1>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="break-all">{client.email}</span>
              </div>
              
              {client.phone && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{client.phone}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Cliente desde {createdDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Botões de Ação */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 lg:flex-shrink-0">
          <button className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Edit className="h-4 w-4" />
            <span>Editar Cliente</span>
          </button>
          <button className="inline-flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            <MoreHorizontal className="h-4 w-4" />
            <span>Mais Opções</span>
          </button>
        </div>
      </div>
    </div>
  )
}