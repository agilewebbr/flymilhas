import { useAuth } from '@/components/AuthProvider'
import { UpdateAccountInput } from '@/lib/validations/account'

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export function useAccount() {
  const { session } = useAuth()
  
  const updateAccount = async (accountId: string, data: UpdateAccountInput) => {
    if (!session?.access_token) {
      return { success: false, error: 'Não autenticado' }
    }

    try {
      const response = await fetch(`/api/gestor/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const result: ApiResponse<any> = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      return { success: true, data: result.data }
    } catch (err) {
      console.error('Erro ao atualizar conta:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      }
    }
  }

  return {
    updateAccount
  }
}