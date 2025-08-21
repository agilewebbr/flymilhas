| schemaname | tablename      | indexname                     | indexdef                                                                                         |
| ---------- | -------------- | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| public     | accounts       | accounts_pkey                 | CREATE UNIQUE INDEX accounts_pkey ON public.accounts USING btree (id)                            |
| public     | accounts       | idx_accounts_client           | CREATE INDEX idx_accounts_client ON public.accounts USING btree (client_id)                      |
| public     | clients        | clients_pkey                  | CREATE UNIQUE INDEX clients_pkey ON public.clients USING btree (id)                              |
| public     | leads          | idx_leads_created_at          | CREATE INDEX idx_leads_created_at ON public.leads USING btree (created_at DESC)                  |
| public     | leads          | idx_leads_email               | CREATE INDEX idx_leads_email ON public.leads USING btree (email)                                 |
| public     | leads          | idx_leads_quantidade_clientes | CREATE INDEX idx_leads_quantidade_clientes ON public.leads USING btree (quantidade_clientes)     |
| public     | leads          | idx_leads_status              | CREATE INDEX idx_leads_status ON public.leads USING btree (status)                               |
| public     | leads          | idx_leads_tempo_milhas        | CREATE INDEX idx_leads_tempo_milhas ON public.leads USING btree (tempo_milhas)                   |
| public     | leads          | idx_leads_utm_source          | CREATE INDEX idx_leads_utm_source ON public.leads USING btree (utm_source)                       |
| public     | leads          | leads_pkey                    | CREATE UNIQUE INDEX leads_pkey ON public.leads USING btree (id)                                  |
| public     | profiles       | profiles_pkey                 | CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (user_id)                       |
| public     | subscriptions  | subscriptions_pkey            | CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id)                  |
| public     | system_metrics | system_metrics_pkey           | CREATE UNIQUE INDEX system_metrics_pkey ON public.system_metrics USING btree (id)                |
| public     | transactions   | idx_transactions_account_date | CREATE INDEX idx_transactions_account_date ON public.transactions USING btree (account_id, date) |
| public     | transactions   | transactions_pkey             | CREATE UNIQUE INDEX transactions_pkey ON public.transactions USING btree (id)                    |