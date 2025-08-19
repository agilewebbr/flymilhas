'use client'

import { useClient } from '@/hooks/useClient'

// SUBSTITUA por um ID real do seu banco de clientes
const TEST_ID = 'cole-um-id-real-aqui'

export default function TestClientPage() {
  const { client, loading, error } = useClient(TEST_ID)
  
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">🧪 Teste useClient Hook</h1>
      
      {loading && <p className="text-blue-600">🔄 Carregando cliente...</p>}
      
      {error && (
        <div className="bg-red-50 p-4 rounded text-red-600">
          ❌ Erro: {error}
        </div>
      )}
      
      {client && (
        <div className="bg-green-50 p-4 rounded">
          <h2 className="text-green-800 font-bold mb-2">✅ Cliente carregado!</h2>
          <p><strong>ID:</strong> {client.id}</p>
          <p><strong>Nome:</strong> {client.name}</p>
          <p><strong>Email:</strong> {client.email}</p>
          {client.phone && <p><strong>Telefone:</strong> {client.phone}</p>}
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p>💡 <strong>Para pegar um ID real:</strong></p>
        <p>1. Vá em /clients (sua listagem)</p>
        <p>2. Abra DevTools (F12)</p>
        <p>3. Console: inspecione a rede ou os dados</p>
      </div>
    </div>
  )
}