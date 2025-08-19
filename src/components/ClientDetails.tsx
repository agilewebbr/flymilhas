import { Client } from '@/lib/database.types'
import ClientHeader from './ClientHeader'
import ClientStats from './ClientStats'
import { Plus, CreditCard, History, Settings, AlertCircle } from 'lucide-react'

interface ClientDetailsProps {
  client: Client
}

export default function ClientDetails({ client }: ClientDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header do Cliente */}
      <ClientHeader client={client} />

      {/* Stats do Cliente */}
      <ClientStats client={client} />

      {/* Seção de Contas de Milhas (Placeholder para Sprint 3) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Contas de Milhas</h3>
            <p className="text-gray-600 text-sm mt-1">Gerencie as contas de milhas deste cliente</p>
          </div>
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto justify-center sm:justify-start">
            <Plus className="h-4 w-4" />
            <span>Adicionar Conta</span>
          </button>
        </div>

        {/* Placeholder para Sprint 3 */}
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conta cadastrada</h4>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Este cliente ainda não possui contas de milhas cadastradas. Adicione a primeira conta para começar o gerenciamento.
          </p>
          <div className="inline-flex items-center space-x-2 text-blue-600 font-medium text-sm bg-blue-50 px-3 py-2 rounded-full">
            <Settings className="h-4 w-4" />
            <span>Funcionalidade do Sprint 3</span>
          </div>
        </div>
      </div>

      {/* Seção de Histórico (Placeholder para Sprint 3) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Histórico de Transações</h3>
            <p className="text-gray-600 text-sm mt-1">Acompanhe todas as movimentações de milhas</p>
          </div>
        </div>
        
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <History className="h-6 w-6 text-gray-400" />
          </div>
          <h4 className="text-base font-medium text-gray-900 mb-2">Sem histórico disponível</h4>
          <p className="text-gray-600 text-sm mb-3">
            O histórico detalhado será implementado no próximo sprint.
          </p>
          <div className="inline-flex items-center space-x-2 text-amber-600 font-medium text-sm bg-amber-50 px-3 py-2 rounded-full">
            <AlertCircle className="h-4 w-4" />
            <span>Em desenvolvimento</span>
          </div>
        </div>
      </div>

      {/* Seção de Configurações Rápidas (Placeholder) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Configurações do Cliente</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Notificações</h4>
            <p className="text-sm text-gray-600">Configurar alertas e notificações</p>
            <div className="mt-3">
              <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Sprint 3
              </span>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Preferências</h4>
            <p className="text-sm text-gray-600">Definir preferências de resgate</p>
            <div className="mt-3">
              <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Sprint 3
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}