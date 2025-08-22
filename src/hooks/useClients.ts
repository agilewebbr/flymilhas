import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import type { Client } from '@/lib/database.types'
import type { CreateClientInput, UpdateClientInput, ClientQueryInput } from '@/lib/validations/client'

interface UseClientsReturn {
  clients: Client[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  createClient: (data: CreateClientInput) => Promise<void>
  updateClient: (id: string, data: UpdateClientInput) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  refreshClients: () => Promise<void>
  setQuery: (query: Partial<ClientQueryInput>) => void
}

export function useClients(initialQuery: Partial<ClientQueryInput> = {}): UseClientsReturn {
  const { session } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQueryState] = useState<ClientQueryInput>({
    page: '1',
    limit: '10',
    sortBy: 'created_at',
    sortOrder: 'desc',
    ...initialQuery
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const fetchClients = async () => {
    if (!session?.access_token) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/clients?${params}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar clientes')
      }

      setClients(data.clients)
      setPagination({
        page: data.data.pagination.page,
        limit: data.data.pagination.limit,
        total: data.data.pagination.totalCount,
        totalPages: data.data.pagination.totalPages
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const createClient = async (data: CreateClientInput) => {
    if (!session?.access_token) throw new Error('Não autenticado')

    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao criar cliente')
    }

    await fetchClients() // Refresh da lista
  }

  const updateClient = async (id: string, data: UpdateClientInput) => {
    
    const response = await fetch(`/api/gestor/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao atualizar cliente')
    }

    await fetchClients() // Refresh da lista
  }

  const deleteClient = async (id: string) => {

    const response = await fetch(`/api/clients/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Erro ao deletar cliente')
    }

    await fetchClients() // Refresh da lista
  }

  const setQuery = (newQuery: Partial<ClientQueryInput>) => {
    setQueryState(prev => ({ ...prev, ...newQuery }))
  }

  useEffect(() => {
    if (session?.access_token) {
      fetchClients()
    }
  }, [session, query])

  return {
    clients,
    loading,
    error,
    pagination,
    createClient,
    updateClient,
    deleteClient,
    refreshClients: fetchClients,
    setQuery
  }
}