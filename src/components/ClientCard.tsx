import Link from 'next/link'
import { Client } from '@/lib/database.types'
import { User, Mail, Phone, CreditCard, Edit2, Trash2, ExternalLink } from 'lucide-react'

interface ClientCardProps {
  client: Client & {
    accounts?: Array<{
      id: string
      program_name: string
      current_balance: number
    }>
  }
  onDelete: () => void
}

export function ClientCard({ client, onDelete }: ClientCardProps) {
  const accountsCount = client.accounts?.length || 0
  const totalBalance = client.accounts?.reduce((sum, account) => sum + account.current_balance, 0) || 0

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('pt-BR').format(balance)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-brand-600">
                {getInitials(client.name)}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              {client.name}
            </h3>
            <p className="text-sm text-gray-500">
              Cliente desde {new Date(client.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            href={`/clients/${client.id}`}
            className="text-gray-400 hover:text-brand-600 transition-colors"
            title="Ver detalhes"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <Link
            href={`/clients/${client.id}/edit`}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Editar cliente"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Deletar cliente"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Informações de Contato */}
      <div className="space-y-2 mb-4">
        {client.email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2 text-gray-400" />
            <span>{client.phone}</span>
          </div>
        )}
        {client.notes && (
          <div className="flex items-start text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
            <span className="line-clamp-2">{client.notes}</span>
          </div>
        )}
      </div>

      {/* Estatísticas das Contas */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              {accountsCount} conta{accountsCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {formatBalance(totalBalance)} pts
            </p>
            <p className="text-xs text-gray-500">Total em milhas</p>
          </div>
        </div>

        {/* Preview dos Programas */}
        {client.accounts && client.accounts.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {client.accounts.slice(0, 3).map((account) => (
                <span
                  key={account.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {account.program_name}
                </span>
              ))}
              {client.accounts.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{client.accounts.length - 3} mais
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href={`/clients/${client.id}`}
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors text-center block"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  )
}