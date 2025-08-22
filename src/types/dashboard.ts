// ==========================================
// FLYMILHAS - TYPES PARA DASHBOARD
// ==========================================

export interface AccountMetrics {
  totalAccounts: number
  totalMiles: number
  totalClients: number
  averageMilesPerClient: number
}

export interface CompanyDistribution {
  company: string
  balance: number
  percentage: number
  accountCount: number
  color: string
}

export interface TopClient {
  id: string
  name: string
  email: string
  totalMiles: number
  accountCount: number
}

export interface TransactionSummary {
  id: string
  clientName: string
  programName: string
  type: string
  points: number
  date: string
  description?: string
}

export interface MonthlyEvolution {
  month: string
  totalMiles: number
  newAccounts: number
}

// Dados base das tabelas (baseados na estrutura real)
export interface Client {
  id: string
  gestor_id: string
  user_id?: string
  name: string
  email?: string
  phone?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  client_id: string
  program_name: string
  account_number?: string
  current_balance: number
  currency: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  account_id: string
  type: string
  points: number
  date: string
  description?: string
  created_at: string
}

// Response types para APIs
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface DashboardData {
  metrics: AccountMetrics
  companyDistribution: CompanyDistribution[]
  topClients: TopClient[]
  recentTransactions: TransactionSummary[]
}