// src/hooks/useTransactions.ts
import { useState, useEffect, useCallback } from 'react'
import { Transaction, TransactionFormData, TransactionFilters } from '@/types/transaction'

interface UseTransactionsReturn {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  setFilters: (filters: TransactionFilters) => void
  refetch: () => void
  createTransaction: (data: TransactionFormData) => Promise<{ success: boolean; data?: Transaction; error?: string }>
  updateTransaction: (id: string, data: TransactionFormData) => Promise<{ success: boolean; data?: Transaction; error?: string }>
  deleteTransaction: (id: string) => Promise<{ success: boolean; error?: string }>
}

interface UseTransactionsProps {
  accountId?: string
  initialFilters?: TransactionFilters
  limit?: number
}

export function useTransactions({ 
  accountId, 
  initialFilters = {}, 
  limit = 20 
}: UseTransactionsProps = {}): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState<TransactionFilters>({
    ...initialFilters,
    ...(accountId && { account_id: accountId })
  })

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Construir query params
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString()
      })

      // Adicionar filtros aos params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/transactions?${params.toString()}`)
      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Erro ao buscar transações')
      }

      setTransactions(result.data.transactions)
      setTotalCount(result.data.totalCount)
      setTotalPages(result.data.totalPages)
    } catch (err) {
      console.error('Erro ao buscar transações:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [currentPage, limit, filters])

  const createTransaction = async (data: TransactionFormData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        return { success: false, error: result.error || 'Erro ao criar transação' }
      }

      // Adicionar nova transação ao início da lista (otimistic update)
      setTransactions(prev => [result.data, ...prev])
      setTotalCount(prev => prev + 1)

      return { success: true, data: result.data }
    } catch (err) {
      console.error('Erro ao criar transação:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      }
    }
  }

  const updateTransaction = async (id: string, data: TransactionFormData) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        return { success: false, error: result.error || 'Erro ao atualizar transação' }
      }

      // Atualizar transação na lista (optimistic update)
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? result.data : transaction
        )
      )

      return { success: true, data: result.data }
    } catch (err) {
      console.error('Erro ao atualizar transação:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      }
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        return { success: false, error: result.error || 'Erro ao deletar transação' }
      }

      // Remover transação da lista (optimistic update)
      setTransactions(prev => prev.filter(transaction => transaction.id !== id))
      setTotalCount(prev => prev - 1)

      return { success: true }
    } catch (err) {
      console.error('Erro ao deletar transação:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      }
    }
  }

  const refetch = useCallback(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // Fetch inicial e quando dependências mudam
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // Reset para página 1 quando filtros mudam
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [filters])

  return {
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
  }
}

// Hook específico para uma conta
export function useAccountTransactions(accountId: string, limit = 10) {
  return useTransactions({
    accountId,
    limit,
    initialFilters: { account_id: accountId }
  })
}

// Hook para todas as transações do gestor
export function useAllTransactions(initialFilters?: TransactionFilters, limit = 20) {
  return useTransactions({
    initialFilters,
    limit
  })
}