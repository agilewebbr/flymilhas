import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  notes: z.string().max(500, 'Notas não podem exceder 500 caracteres').optional().or(z.literal(''))
})

export const updateClientSchema = createClientSchema.partial()

export const clientQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'created_at']).optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
})

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
export type ClientQueryInput = z.infer<typeof clientQuerySchema>