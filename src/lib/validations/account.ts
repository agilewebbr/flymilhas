import { z } from 'zod'

// Programas de fidelidade disponíveis
export const LOYALTY_PROGRAMS = [
  'Smiles',
  'Latam Pass', 
  'Azul',
  'Livelo',
  'Esfera',
  'Outro'
] as const

export const TRANSACTION_TYPES = ['acumulo', 'resgate'] as const

// Schema para criar conta de programa de fidelidade
export const createAccountSchema = z.object({
  client_id: z.string().uuid('ID do cliente inválido'),
  program_name: z.enum(LOYALTY_PROGRAMS, {
    errorMap: () => ({ message: 'Programa de fidelidade inválido' })
  }),
  account_number: z.string()
    .min(1, 'Número da conta é obrigatório')
    .max(100, 'Número da conta muito longo')
    .optional()
    .or(z.literal('')),
  currency: z.string().default('points')
})

// Schema para atualizar conta
export const updateAccountSchema = z.object({
  program_name: z.enum(LOYALTY_PROGRAMS).optional(),
  account_number: z.string()
    .max(100, 'Número da conta muito longo')
    .optional()
    .or(z.literal('')),
  currency: z.string().optional()
})

// Schema para query de contas
export const accountQuerySchema = z.object({
  client_id: z.string().uuid().optional(),
  program_name: z.enum(LOYALTY_PROGRAMS).optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10')
})

// Schema para criar transação
export const createTransactionSchema = z.object({
  account_id: z.string().uuid('ID da conta inválido'),
  type: z.enum(TRANSACTION_TYPES, {
    errorMap: () => ({ message: 'Tipo de transação inválido (acumulo ou resgate)' })
  }),
  points: z.number()
    .int('Pontos devem ser um número inteiro')
    .positive('Pontos devem ser positivos')
    .max(999999999, 'Quantidade de pontos muito alta'),
  date: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Data inválida')
    .transform((date) => new Date(date).toISOString().split('T')[0]), // YYYY-MM-DD
  description: z.string()
    .max(500, 'Descrição não pode exceder 500 caracteres')
    .optional()
    .or(z.literal(''))
})

// Schema para atualizar transação
export const updateTransactionSchema = z.object({
  type: z.enum(TRANSACTION_TYPES).optional(),
  points: z.number()
    .int('Pontos devem ser um número inteiro')
    .positive('Pontos devem ser positivos')
    .max(999999999, 'Quantidade de pontos muito alta')
    .optional(),
  date: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Data inválida')
    .transform((date) => new Date(date).toISOString().split('T')[0])
    .optional(),
  description: z.string()
    .max(500, 'Descrição não pode exceder 500 caracteres')
    .optional()
    .or(z.literal(''))
})

// Schema para query de transações
export const transactionQuerySchema = z.object({
  account_id: z.string().uuid().optional(),
  type: z.enum(TRANSACTION_TYPES).optional(),
  start_date: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Data inicial inválida')
    .optional(),
  end_date: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Data final inválida')
    .optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  sortBy: z.enum(['date', 'points', 'created_at']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
})

// Types inferidos
export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>
export type AccountQueryInput = z.infer<typeof accountQuerySchema>

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>

export type LoyaltyProgram = typeof LOYALTY_PROGRAMS[number]
export type TransactionType = typeof TRANSACTION_TYPES[number]