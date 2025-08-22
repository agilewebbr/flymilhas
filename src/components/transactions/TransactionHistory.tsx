// src/components/transactions/TransactionHistory.tsx
'use client'

import { useState } from 'react'
import { Plus, History, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { useAccountTransactions } from '@/hooks/useTransactions'
import { Transaction, TransactionFilters } from '@/types/transaction'
import TransactionModal from './TransactionModal'
import TransactionCard from './TransactionCard'
import TransactionFiltersComponent from './TransactionFilters'

interface TransactionHistoryProps {
  accountId: string
  accountName?: string
  maxHeight?: string
  showFilters?: boolean
  limit?: number
}

export default function TransactionHistory({
  accountId,
  accountName,
  maxHeight = 'max-h-96',
  showFilters = true,
  limit = 10
}: TransactionHistoryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    transactions,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    setCurrentPage,
    setFilters,
    refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useAccountTransactions(accountId, limit)

  const handleCreateSuccess = (transaction: Transaction) => {
    setSuccessMessage('Transação criada com sucesso!')
    setTimeout(() => setSuccessMessage(''), 3000)
    refetch()
  }

  const handleUpdateSuccess = (transaction: Transaction) => {
    setSuccessMessage('Transação atualizada com sucesso!')
    setTimeout(() => setSuccessMessage(''), 3000)
    setEditingTransaction(undefined)
    refetch()
  }

  const handleError = (error: string) => {
    setErrorMessage(error)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleDelete = async (transactionId: string) => {
    const result = await deleteTransaction(transactionId)
    if (result.success) {
      setSuccessMessage('Transação excluída com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      handleError(result.error || 'Erro ao excluir transação')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(undefined)
  }

  const handleFiltersChange = (newFilters: TransactionFilters) => {
    setFilters({ ...newFilters, account_id: accountId })
  }

  const handleFiltersReset = () => {
    setFilters({ account_id: accountId })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Histórico de Transações
          </h3>
          {totalCount > 0 && (
            <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
              {totalCount}
            </span>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Transação</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <TransactionFiltersComponent
          filters={{ account_id: accountId }}
          onFiltersChange={handleFiltersChange}
          onReset={handleFiltersReset}
        />
      )}

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Loading State */}
        {loading && (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-red-800 font-medium">Erro ao carregar transações</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={refetch}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && transactions.length === 0 && (
          <div className="p-6 text-center">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-gray-900 font-medium mb-2">Nenhuma transação encontrada</h4>
            <p className="text-gray-600 text-sm mb-4">
              Comece registrando a primeira transação desta conta.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrar Primeira Transação
            </button>
          </div>
        )}

        {/* Transactions List */}
        {!loading && !error && transactions.length > 0 && (
          <>
            <div className={`${maxHeight} overflow-y-auto`}>
              <div className="p-4 space-y-3">
                {transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showAccount={false}
                  />
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages} ({totalCount} transações)
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
                      {currentPage}
                    </span>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        accountId={accountId}
        accountName={accountName}
        transaction={editingTransaction}
        onSuccess={editingTransaction ? handleUpdateSuccess : handleCreateSuccess}
        onError={handleError}
      />
    </div>
  )
}