import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import type { Client } from '@/lib/database.types'

interface UseClientReturn {
  client: Client | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useClient(id: string): UseClientReturn {
  const { session } = useAuth()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClient = async () => {
    if (!session?.access_token) return

    setLoading(true)
    setError(null)

    try {
      console.log('🔍 Buscando cliente ID:', id) // Debug

      const response = await fetch(`/api/gestor/clients/${id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar cliente')
      }

      console.log('✅ Cliente encontrado:', data.client) // Debug
      setClient(data.client)
    } catch (err) {
      console.error('❌ Erro no useClient:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setClient(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.access_token && id) {
      fetchClient()
    }
  }, [session, id])

  return {
    client,
    loading,
    error,
    refetch: fetchClient
  }
}