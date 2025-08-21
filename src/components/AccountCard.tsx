import { Account } from '@/lib/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Trash2, Edit, CreditCard } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AccountCardProps {
  account: Account
  onEdit?: (account: Account) => void
  onDelete?: (accountId: string) => void
  onViewTransactions?: (accountId: string) => void
}

// Mapear programas para cores
const programColors: Record<string, string> = {
  'Smiles': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Latam Pass': 'bg-red-100 text-red-800 border-red-200', 
  'Azul': 'bg-blue-100 text-blue-800 border-blue-200',
  'Livelo': 'bg-green-100 text-green-800 border-green-200',
  'Esfera': 'bg-purple-100 text-purple-800 border-purple-200',
  'Outro': 'bg-gray-100 text-gray-800 border-gray-200'
}

export default function AccountCard({ 
  account, 
  onEdit, 
  onDelete, 
  onViewTransactions 
}: AccountCardProps) {
  
  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('pt-BR').format(balance)
  }

  const getProgramColor = (program: string) => {
    return programColors[program] || programColors['Outro']
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            {account.program_name}
          </div>
        </CardTitle>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(account)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar conta
              </DropdownMenuItem>
            )}
            {onViewTransactions && (
              <DropdownMenuItem onClick={() => onViewTransactions(account.id)}>
                <CreditCard className="mr-2 h-4 w-4" />
                Ver transações
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={() => onDelete(account.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remover conta
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Saldo */}
          <div>
            <p className="text-2xl font-bold">
              {formatBalance(account.current_balance)}
            </p>
            <p className="text-xs text-muted-foreground">
              {account.currency === 'points' ? 'pontos' : account.currency}
            </p>
          </div>

          {/* Número da conta */}
          {account.account_number && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conta:</span>
              <span className="text-sm font-medium">
                {account.account_number}
              </span>
            </div>
          )}

          {/* Badge do programa */}
          <div className="flex justify-start">
            <Badge 
              variant="outline" 
              className={getProgramColor(account.program_name)}
            >
              {account.program_name}
            </Badge>
          </div>

          {/* Data de criação */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Criada em:</span>
            <span>
              {new Date(account.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}