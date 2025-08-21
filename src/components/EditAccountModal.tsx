import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { updateAccountSchema, LOYALTY_PROGRAMS, UpdateAccountInput } from '@/lib/validations/account'
import { Account } from '@/lib/database.types'

interface EditAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: Account | null
  onUpdateAccount: (accountId: string, data: UpdateAccountInput) => Promise<{ success: boolean; error?: string }>
  clientName: string
}

export default function EditAccountModal({
  open,
  onOpenChange,
  account,
  onUpdateAccount,
  clientName
}: EditAccountModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<UpdateAccountInput>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      program_name: undefined,
      account_number: '',
      currency: 'points'
    }
  })

  // Atualizar form quando account mudar
  useEffect(() => {
    if (account && open) {
      form.reset({
        program_name: account.program_name as any,
        account_number: account.account_number || '',
        currency: account.currency
      })
    }
  }, [account, open, form])

  const onSubmit = async (data: UpdateAccountInput) => {
    if (!account) return

    try {
      setIsLoading(true)
      
      const result = await onUpdateAccount(account.id, data)
      
      if (result.success) {
        onOpenChange(false)
      } else {
        form.setError('root', {
          message: result.error || 'Erro ao atualizar conta'
        })
      }
    } catch (error) {
      form.setError('root', {
        message: 'Erro interno do servidor'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      form.clearErrors()
    }
    onOpenChange(open)
  }

  if (!account) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Conta de Milhas</DialogTitle>
          <DialogDescription>
            Atualizar informações da conta {account.program_name} de {clientName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Programa de Fidelidade */}
            <FormField
              control={form.control}
              name="program_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programa de Fidelidade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o programa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LOYALTY_PROGRAMS.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Alterar programa pode afetar histórico de transações
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número da Conta */}
            <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Conta</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: 123456789" 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Número da conta no programa (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Moeda/Tipo */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Pontuação</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="points">Pontos</SelectItem>
                      <SelectItem value="miles">Milhas</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Tipo de pontuação do programa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Informações do saldo atual */}
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="text-sm text-blue-800">
                <strong>Saldo atual:</strong> {new Intl.NumberFormat('pt-BR').format(account.current_balance)} {account.currency === 'points' ? 'pontos' : 'milhas'}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                O saldo não pode ser alterado aqui. Use as transações para ajustar saldos.
              </div>
            </div>

            {/* Erro geral */}
            {form.formState.errors.root && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {form.formState.errors.root.message}
              </div>
            )}

            {/* Botões */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}