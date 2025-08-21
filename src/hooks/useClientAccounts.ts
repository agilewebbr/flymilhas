import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Account } from '@/lib/database.types'
import { CreateAccountInput } from '@/lib/validations/account'

interface ClientAccountsData {
  client: {
    id: string
    name: string
  }
  accounts: Account[]
  summary: {
    total_accounts: number
    total_balance: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export function useClientAccounts(clientId: string) {
  const { session } = useAuth()
  const [data, setData] = useState<ClientAccountsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccounts = async () => {
    if (!session?.access_token) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/gestor/clients/${clientId}/accounts`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const result: ApiResponse<ClientAccountsData> = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      setData(result.data)
    } catch (err) {
      console.error('Erro ao buscar contas:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const createAccount = async (accountData: Omit<CreateAccountInput, 'client_id'>) => {
    if (!session?.access_token) {
      return { success: false, error: 'Não autenticado' }
    }

    try {
      const response = await fetch(`/api/gestor/clients/${clientId}/accounts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(accountData)
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const result: ApiResponse<Account> = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      // Recarregar lista após criar
      await fetchAccounts()
      
      return { success: true, data: result.data }
    } catch (err) {
      console.error('Erro ao criar conta:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      }
    }
  }

  const deleteAccount = async (accountId: string) => {
    if (!session?.access_token) {
      return { success: false, error: 'Não autenticado' }
    }

    try {
      const response = await fetch(`/api/gestor/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const result: ApiResponse<any> = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      // Recarregar lista após deletar
      await fetchAccounts()
      
      return { success: true, message: result.data?.message }
    } catch (err) {
      console.error('Erro ao deletar conta:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      }
    }
  }

  useEffect(() => {
    if (session?.access_token && clientId) {
      fetchAccounts()
    }
  }, [session, clientId])

  return {
    data,
    loading,
    error,
    refetch: fetchAccounts,
    createAccount,
    deleteAccount
  }
}