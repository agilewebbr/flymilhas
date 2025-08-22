// src/components/transactions/TransactionModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Plus, Minus, Save, Loader2 } from 'lucide-react'
import { transactionSchema, type TransactionFormData } from '@/lib/validations/transaction'
import { Transaction } from '@/types/transaction'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  accountId: string
  accountName?: string
  transaction?: Transaction // Para edição
  onSuccess: (transaction: Transaction) => void
  onError: (error: string) => void
}

export default function TransactionModal({
  isOpen,
  onClose,
  accountId,
  accountName,
  transaction,
  onSuccess,
  onError
}: TransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!transaction

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      account_id: accountId,
      type: 'credit',
      points: 0,
      description: '',
      date: new Date().toISOString().split('T')[0]
    }
  })

  // Preencher form quando editando
  useEffect(() => {
    if (isEditing && transaction) {
      form.reset({
        account_id: transaction.account_id,
        type: transaction.type as 'credit' | 'debit',
        points: transaction.points,
        description: transaction.description || '',
        date: transaction.date
      })
    } else {
      form.reset({
        account_id: accountId,
        type: 'credit',
        points: 0,
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
    }
  }, [isEditing, transaction, accountId, form])

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true)
    
    try {
      const url = isEditing ? `/api/transactions/${transaction.id}` : '/api/transactions'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Erro ao salvar transação')
      }

      onSuccess(result.data)
      onClose()
      
      // Reset form
      if (!isEditing) {
        form.reset({
          account_id: accountId,
          type: 'credit',
          points: 0,
          description: '',
          date: new Date().toISOString().split('T')[0]
        })
      }
    } catch (error) {
      console.error('Erro ao salvar transação:', error)
      onError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const watchedType = form.watch('type')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Editar Transação' : 'Nova Transação'}
            </h2>
            {accountName && (
              <p className="text-sm text-gray-500 mt-1">{accountName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Tipo de Transação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Transação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => form.setValue('type', 'credit')}
                className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  watchedType === 'credit'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Acúmulo</span>
              </button>
              
              <button
                type="button"
                onClick={() => form.setValue('type', 'debit')}
                className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  watchedType === 'debit'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Minus className="h-5 w-5" />
                <span className="font-medium">Resgate</span>
              </button>
            </div>
            {form.formState.errors.type && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.type.message}
              </p>
            )}
          </div>

          {/* Quantidade de Pontos */}
          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de Pontos/Milhas
            </label>
            <input
              id="points"
              type="number"
              min="1"
              step="1"
              {...form.register('points', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 10000"
            />
            {form.formState.errors.points && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.points.message}
              </p>
            )}
          </div>

          {/* Data */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Data da Transação
            </label>
            <input
              id="date"
              type="date"
              {...form.register('date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {form.formState.errors.date && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              {...form.register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Ex: Compra no cartão, transferência de terceiros..."
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isEditing ? 'Salvar' : 'Criar Transação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}