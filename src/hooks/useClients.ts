// Na linha do select, altere de:
.select('*, accounts(count)', { count: 'exact' })

// Para:
.select(`
  *,
  accounts (
    id,
    program_name,
    current_balance,
    currency
  )
`, { count: 'exact' })