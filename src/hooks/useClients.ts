.select(`
  *,
  accounts (
    id,
    program_name,
    current_balance,
    currency
  )
`, { count: 'exact' })