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