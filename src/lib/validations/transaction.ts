// src/lib/validations/transaction.ts
import { z } from 'zod'

export const transactionSchema = z.object({
  account_id: z.string().uuid('ID da conta inválido'),
  type: z.enum(['credit', 'debit'], {
    required_error: 'Tipo de transação é obrigatório'
  }),
  points: z.number()
    .positive('Valor deve ser positivo')
    .int('Valor deve ser um número inteiro')
    .max(999999999, 'Valor máximo 999.999.999 pontos'),
  description: z.string().max(200, 'Descrição muito longa').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
})

export const transactionFiltersSchema = z.object({
  account_id: z.string().uuid().optional(),
  type: z.enum(['credit', 'debit', 'transfer_in', 'transfer_out']).optional(),
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  min_points: z.number().min(0).optional(),
  max_points: z.number().min(0).optional(),
  search: z.string().max(100).optional()
})

export type TransactionFormData = z.infer<typeof transactionSchema>
export type TransactionFilters = z.infer<typeof transactionFiltersSchema>