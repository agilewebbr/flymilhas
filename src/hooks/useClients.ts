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
  const { user, loading: authLoading, session } = useAuth()
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
    if (!user || authLoading || !session?.access_token) {
      console.log('🔍 fetchClients: Saindo cedo - user:', !!user, 'authLoading:', authLoading, 'token:', !!session?.access_token)
      return
    }
    
    console.log('🔍 fetchClients: Fazendo requisição com token...')
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/clients?${params}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setClients(data.data.clients)
      setPagination({
        page: data.data.pagination.page,
        limit: data.data.pagination.limit,
        total: data.data.pagination.totalCount,
        totalPages: data.data.pagination.totalPages
      })
    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const createClient = async (data: CreateClientInput) => {
    if (!user || !session?.access_token) throw new Error('Não autenticado')

    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao criar cliente')
    }

    await fetchClients()
  }

  const updateClient = async (id: string, data: UpdateClientInput) => {
    if (!user || !session?.access_token) throw new Error('Não autenticado')

    const response = await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao atualizar cliente')
    }

    await fetchClients()
  }

  const deleteClient = async (id: string) => {
    if (!user || !session?.access_token) throw new Error('Não autenticado')

    const response = await fetch(`/api/clients/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Erro ao deletar cliente')
    }

    await fetchClients()
  }

  const setQuery = (newQuery: Partial<ClientQueryInput>) => {
    setQueryState(prev => ({ ...prev, ...newQuery }))
  }

  useEffect(() => {
    if (!authLoading && user && session?.access_token) {
      fetchClients()
    }
  }, [user, authLoading, session?.access_token, query])

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