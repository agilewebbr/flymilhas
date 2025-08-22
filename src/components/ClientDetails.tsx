'use client'

import { useState } from 'react'
import { Client, Account } from '@/lib/database.types'
import ClientHeader from './ClientHeader'
import ClientStats from './ClientStats'
import AccountCard from './AccountCard'
import CreateAccountModal from './CreateAccountModal'
import EditAccountModal from './EditAccountModal'
import { useClientAccounts } from '@/hooks/useClientAccounts'
import { useAccount } from '@/hooks/useAccount'
import { CreateAccountInput, UpdateAccountInput } from '@/lib/validations/account'
import { Plus, CreditCard, History, Settings, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import TransactionHistory from '@/components/transactions/TransactionHistory'

interface ClientDetailsProps {
  client: Client
}

export default function ClientDetails({ client }: ClientDetailsProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

  // Hooks para contas
  const { 
    data: accountsData, 
    loading: accountsLoading, 
    error: accountsError,
    refetch: refetchAccounts,
    createAccount,
    deleteAccount
  } = useClientAccounts(client.id)
  const { updateAccount } = useAccount()

  // Handlers para contas
  const handleCreateAccount = async (accountData: Omit<CreateAccountInput, 'client_id'>) => {
    return await createAccount(accountData)
  }

  const handleUpdateAccount = async (accountId: string, data: UpdateAccountInput) => {
    const result = await updateAccount(accountId, data)
    if (result.success) {
      await refetchAccounts()
    }
    return result
  }

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account)
    setEditModalOpen(true)
  }

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm('Tem certeza que deseja remover esta conta? Esta ação não pode ser desfeita.')) {
      await deleteAccount(accountId)
    }
  }

  const [selectedAccountForTransactions, setSelectedAccountForTransactions] = useState<Account | null>(null)

  const handleViewTransactions = (accountId: string) => {
    const account = accountsData?.accounts.find(acc => acc.id === accountId)
    if (account) {
      setSelectedAccountForTransactions(account)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header do Cliente */}
      <ClientHeader client={client} />

      {/* Stats do Cliente */}
      <ClientStats client={client} />

      {/* Seção de Contas de Milhas - IMPLEMENTAÇÃO REAL */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Contas de Milhas</h3>
            <p className="text-gray-600 text-sm mt-1">Gerencie as contas de programas de fidelidade</p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Conta
          </Button>
        </div>

        {/* Loading das contas */}
        {accountsLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Carregando contas...
          </div>
        )}

        {/* Erro nas contas */}
        {accountsError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{accountsError}</AlertDescription>
          </Alert>
        )}

        {/* Conteúdo das contas */}
        {accountsData && !accountsLoading && (
          <>
            {/* Resumo */}
            {accountsData.summary.total_accounts > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">Total de Contas:</span>
                    <div className="text-xl font-bold text-blue-800">
                      {accountsData.summary.total_accounts}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Saldo Total:</span>
                    <div className="text-xl font-bold text-blue-800">
                      {new Intl.NumberFormat('pt-BR').format(accountsData.summary.total_balance)} pontos
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid de contas */}
            {accountsData.accounts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accountsData.accounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onEdit={handleEditAccount}
                    onDelete={handleDeleteAccount}
                    onViewTransactions={handleViewTransactions}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conta cadastrada</h4>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Este cliente ainda não possui contas de milhas cadastradas. Adicione a primeira conta para começar o gerenciamento.
                </p>
                <Button onClick={() => setCreateModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeira Conta
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Seção de Histórico de Transações - IMPLEMENTAÇÃO REAL */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Histórico de Transações</h3>
            <p className="text-gray-600 text-sm mt-1">
              {selectedAccountForTransactions 
                ? `Transações da conta ${selectedAccountForTransactions.program_name}`
                : 'Selecione uma conta para ver o histórico'
              }
            </p>
          </div>
          {selectedAccountForTransactions && (
            <Button 
              variant="outline" 
              onClick={() => setSelectedAccountForTransactions(null)}
            >
              Ver Todas as Contas
            </Button>
          )}
        </div>
        
        {selectedAccountForTransactions ? (
          <TransactionHistory 
            accountId={selectedAccountForTransactions.id}
            accountName={`${selectedAccountForTransactions.program_name} - ${selectedAccountForTransactions.account_number}`}
            showFilters={true}
            limit={10}
          />
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <History className="h-6 w-6 text-gray-400" />
            </div>
            <h4 className="text-base font-medium text-gray-900 mb-2">Selecione uma conta</h4>
            <p className="text-gray-600 text-sm mb-4">
              Clique em "Ver Transações" em qualquer conta acima para visualizar o histórico detalhado.
            </p>
            {accountsData?.accounts.length > 0 && (
              <p className="text-gray-500 text-sm">
                {accountsData.accounts.length} conta(s) disponível(eis) para consulta
              </p>
            )}
          </div>
        )}
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

      {/* Modais */}
      <CreateAccountModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreateAccount={handleCreateAccount}
        clientName={client.name}
      />

      <EditAccountModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        account={editingAccount}
        onUpdateAccount={handleUpdateAccount}
        clientName={client.name}
      />
    </div>
  )
}