export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          name: string | null
          role: 'admin' | 'gestor' | 'cliente'
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name?: string | null
          role?: 'admin' | 'gestor' | 'cliente'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          name?: string | null
          role?: 'admin' | 'gestor' | 'cliente'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          gestor_id: string
          user_id: string | null
          name: string
          email: string | null
          phone: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gestor_id: string
          user_id?: string | null
          name: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gestor_id?: string
          user_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          client_id: string
          program_name: string
          account_number: string | null
          current_balance: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          program_name: string
          account_number?: string | null
          current_balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          program_name?: string
          account_number?: string | null
          current_balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          account_id: string
          type: 'acumulo' | 'resgate'
          points: number
          date: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          account_id: string
          type: 'acumulo' | 'resgate'
          points: number
          date: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          type?: 'acumulo' | 'resgate'
          points?: number
          date?: string
          description?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string | null
          plan_name: string | null
          status: string | null
          start_date: string | null
          end_date: string | null
          monthly_price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          plan_name?: string | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          monthly_price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          plan_name?: string | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          monthly_price?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      system_metrics: {
        Row: {
          id: string
          date: string
          total_users: number | null
          total_gestores: number | null
          total_clientes: number | null
          active_subscriptions: number | null
          mrr: number | null
          churn_rate: number | null
          total_milhas_gerenciadas: number | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          total_users?: number | null
          total_gestores?: number | null
          total_clientes?: number | null
          active_subscriptions?: number | null
          mrr?: number | null
          churn_rate?: number | null
          total_milhas_gerenciadas?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          total_users?: number | null
          total_gestores?: number | null
          total_clientes?: number | null
          active_subscriptions?: number | null
          mrr?: number | null
          churn_rate?: number | null
          total_milhas_gerenciadas?: number | null
          created_at?: string
        }
      }
    }
  }
}

// Utility types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Account = Database['public']['Tables']['accounts']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type SystemMetrics = Database['public']['Tables']['system_metrics']['Row']

export type UserRole = 'admin' | 'gestor' | 'cliente'
export type TransactionType = 'acumulo' | 'resgate'