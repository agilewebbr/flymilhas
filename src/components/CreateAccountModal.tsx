import { useState } from 'react'
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
import { createAccountSchema, LOYALTY_PROGRAMS, CreateAccountInput } from '@/lib/validations/account'

interface CreateAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateAccount: (data: Omit<CreateAccountInput, 'client_id'>) => Promise<{ success: boolean; error?: string }>
  clientName: string
}

export default function CreateAccountModal({
  open,
  onOpenChange,
  onCreateAccount,
  clientName
}: CreateAccountModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<Omit<CreateAccountInput, 'client_id'>>({
    resolver: zodResolver(createAccountSchema.omit({ client_id: true })),
    defaultValues: {
      program_name: undefined,
      account_number: '',
      currency: 'points'
    }
  })

  const onSubmit = async (data: Omit<CreateAccountInput, 'client_id'>) => {
    try {
      setIsLoading(true)
      
      const result = await onCreateAccount(data)
      
      if (result.success) {
        form.reset()
        onOpenChange(false)
      } else {
        form.setError('root', {
          message: result.error || 'Erro ao criar conta'
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
      form.reset()
      form.clearErrors()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Conta de Milhas</DialogTitle>
          <DialogDescription>
            Criar nova conta de programa de fidelidade para {clientName}
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
                    Escolha o programa de milhas/pontos
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
                Criar Conta
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}