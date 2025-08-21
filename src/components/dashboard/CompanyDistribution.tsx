// ==========================================
// FLYMILHAS - COMPANY DISTRIBUTION COMPONENT
// ==========================================

interface CompanyDistributionData {
  company: string
  balance: number
  percentage: number
  accountCount: number
  color: string
}

interface CompanyDistributionProps {
  data: CompanyDistributionData[]
}

export function CompanyDistribution({ data }: CompanyDistributionProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            🏢 Distribuição por Companhia
          </h3>
          <p className="text-sm text-muted-foreground">
            Distribuição de milhas por programa
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📊</div>
            <p>Nenhum dado disponível</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          🏢 Distribuição por Companhia
        </h3>
        <p className="text-sm text-muted-foreground">
          Distribuição de milhas por programa
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {data.map((company) => (
            <div 
              key={company.company} 
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: company.color }}
                />
                <div>
                  <p className="font-medium">{company.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {company.accountCount} {company.accountCount === 1 ? 'conta' : 'contas'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {company.balance.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  {company.percentage}%
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Total */}
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between font-semibold">
            <span>Total Geral</span>
            <span>
              {data.reduce((sum, company) => sum + company.balance, 0).toLocaleString('pt-BR')} milhas
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}