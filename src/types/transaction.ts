// src/types/transaction.ts
export interface Transaction {
  id: string
  account_id: string
  type: string // 'credit' | 'debit' | 'transfer_in' | 'transfer_out'
  points: number
  date: string // formato YYYY-MM-DD
  description?: string
  created_at: string
  
  // Relacionamentos populados via JOIN
  account?: {
    id: string
    program_name: string
    account_number: string
    current_balance: number
    client?: {
      name: string
    }
  }
}

export interface TransactionFormData {
  account_id: string
  type: 'credit' | 'debit'
  points: number
  description?: string
  date: string
}

export interface TransactionFilters {
  account_id?: string
  type?: string
  date_from?: string
  date_to?: string
  min_points?: number
  max_points?: number
  search?: string
}

// Tipos para formatação
export const TRANSACTION_TYPES = {
  credit: 'Acúmulo',
  debit: 'Resgate',
  transfer_in: 'Transferência Recebida',
  transfer_out: 'Transferência Enviada'
} as const

export const TRANSACTION_TYPE_COLORS = {
  credit: 'text-green-600 bg-green-50',
  debit: 'text-red-600 bg-red-50',
  transfer_in: 'text-blue-600 bg-blue-50',
  transfer_out: 'text-yellow-600 bg-yellow-50'
} as const

export const TRANSACTION_TYPE_ICONS = {
  credit: '↗️',
  debit: '↘️',
  transfer_in: '←',
  transfer_out: '→'
} as const

// Helpers
export function formatTransactionType(type: string): string {
  return TRANSACTION_TYPES[type as keyof typeof TRANSACTION_TYPES] || type
}

export function getTransactionTypeColor(type: string): string {
  return TRANSACTION_TYPE_COLORS[type as keyof typeof TRANSACTION_TYPE_COLORS] || 'text-gray-600 bg-gray-50'
}

export function getTransactionTypeIcon(type: string): string {
  return TRANSACTION_TYPE_ICONS[type as keyof typeof TRANSACTION_TYPE_ICONS] || '•'
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('pt-BR').format(points)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString))
}

// Tipos para formatação
export const TRANSACTION_TYPES = {
  credit: 'Acúmulo',
  debit: 'Resgate',
  transfer_in: 'Transferência Recebida',
  transfer_out: 'Transferência Enviada'
} as const

export const TRANSACTION_TYPE_COLORS = {
  credit: 'text-green-600 bg-green-50',
  debit: 'text-red-600 bg-red-50',
  transfer_in: 'text-blue-600 bg-blue-50',
  transfer_out: 'text-yellow-600 bg-yellow-50'
} as const

export const TRANSACTION_TYPE_ICONS = {
  credit: '↗️',
  debit: '↘️',
  transfer_in: '←',
  transfer_out: '→'
} as const

// Helpers
export function formatTransactionType(type: string): string {
  return TRANSACTION_TYPES[type as keyof typeof TRANSACTION_TYPES] || type
}

export function getTransactionTypeColor(type: string): string {
  return TRANSACTION_TYPE_COLORS[type as keyof typeof TRANSACTION_TYPE_COLORS] || 'text-gray-600 bg-gray-50'
}

export function getTransactionTypeIcon(type: string): string {
  return TRANSACTION_TYPE_ICONS[type as keyof typeof TRANSACTION_TYPE_ICONS] || '•'
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('pt-BR').format(points)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString))
}