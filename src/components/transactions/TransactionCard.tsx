// src/components/transactions/TransactionCard.tsx
'use client'

import { useState } from 'react'
import { Edit2, Trash2, Calendar, FileText } from 'lucide-react'
import { Transaction, formatTransactionType, getTransactionTypeColor, formatPoints, formatDate } from '@/types/transaction'

interface TransactionCardProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (transactionId: string) => void
  showAccount?: boolean
}

export default function TransactionCard({
  transaction,
  onEdit,
  onDelete,
  showAccount = false
}: TransactionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete(transaction.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const typeColor = getTransactionTypeColor(transaction.type)
  const isDebit = transaction.type === 'debit'

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        {/* Main Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {/* Type Badge */}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColor}`}>
              {formatTransactionType(transaction.type)}
            </span>
            
            {/* Points */}
            <span className={`text-lg font-semibold ${isDebit ? 'text-red-600' : 'text-green-600'}`}>
              {isDebit ? '-' : '+'}{formatPoints(transaction.points)}
            </span>
          </div>

          {/* Account Info (if showing multiple accounts) */}
          {showAccount && transaction.account && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <span className="font-medium">{transaction.account.program_name}</span>
              <span>•</span>
              <span>{transaction.account.account_number}</span>
              {transaction.account.client && (
                <>
                  <span>•</span>
                  <span>{transaction.account.client.name}</span>
                </>
              )}
            </div>
          )}

          {/* Description */}
          {transaction.description && (
            <div className="flex items-start space-x-2 text-sm text-gray-600 mb-2">
              <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{transaction.description}</span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(transaction.date)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 ml-4">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar transação"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Excluir transação"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}