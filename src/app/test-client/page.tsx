'use client'

import { useClient } from '@/hooks/useClient'
import ClientHeader from '@/components/ClientHeader'

// SUBSTITUA por um ID real do seu banco de clientes
const TEST_ID = 'd4aa7a31-cb68-47e9-b2e8-6c010af4e87f'

export default function TestClientPage() {
  const { client, loading, error } = useClient(TEST_ID)
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl mb-6">🧪 Teste ClientHeader</h1>
      
      {loading && (
        <div className="bg-white p-6 rounded-xl">
          🔄 Carregando cliente...
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 p-4 rounded text-red-600">
          ❌ Erro: {error}
        </div>
      )}
      
      {client && (
        <div className="space-y-6">
          <ClientHeader client={client} />
          
          <div className="bg-green-50 p-4 rounded">
            <h2 className="text-green-800 font-bold">✅ Dados do cliente:</h2>
            <pre className="text-sm mt-2 text-green-700">
              {JSON.stringify(client, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}