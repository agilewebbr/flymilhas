| table_name     | column_name              | data_type                | character_maximum_length | is_nullable | column_default               | constraint_type |
| -------------- | ------------------------ | ------------------------ | ------------------------ | ----------- | ---------------------------- | --------------- |
| accounts       | id                       | uuid                     | null                     | NO          | gen_random_uuid()            | PK              |
| accounts       | client_id                | uuid                     | null                     | NO          | null                         | FK              |
| accounts       | program_name             | text                     | null                     | NO          | null                         |                 |
| accounts       | account_number           | text                     | null                     | YES         | null                         |                 |
| accounts       | current_balance          | bigint                   | null                     | YES         | 0                            |                 |
| accounts       | currency                 | text                     | null                     | YES         | 'points'::text               |                 |
| accounts       | created_at               | timestamp with time zone | null                     | YES         | now()                        |                 |
| accounts       | updated_at               | timestamp with time zone | null                     | YES         | now()                        |                 |
| clients        | id                       | uuid                     | null                     | NO          | gen_random_uuid()            | PK              |
| clients        | gestor_id                | uuid                     | null                     | NO          | null                         | FK              |
| clients        | user_id                  | uuid                     | null                     | YES         | null                         | FK              |
| clients        | name                     | text                     | null                     | NO          | null                         |                 |
| clients        | email                    | text                     | null                     | YES         | null                         |                 |
| clients        | phone                    | text                     | null                     | YES         | null                         |                 |
| clients        | notes                    | text                     | null                     | YES         | null                         |                 |
| clients        | created_at               | timestamp with time zone | null                     | YES         | now()                        |                 |
| clients        | updated_at               | timestamp with time zone | null                     | YES         | now()                        |                 |
| leads          | id                       | uuid                     | null                     | NO          | gen_random_uuid()            | PK              |
| leads          | created_at               | timestamp with time zone | null                     | NO          | timezone('utc'::text, now()) |                 |
| leads          | updated_at               | timestamp with time zone | null                     | NO          | timezone('utc'::text, now()) |                 |
| leads          | nome_completo            | character varying        | 255                      | NO          | null                         |                 |
| leads          | email                    | character varying        | 255                      | NO          | null                         |                 |
| leads          | whatsapp                 | character varying        | 50                       | NO          | null                         |                 |
| leads          | tempo_milhas             | character varying        | 50                       | NO          | null                         |                 |
| leads          | quantidade_clientes      | character varying        | 50                       | NO          | null                         |                 |
| leads          | objetivo_profissional    | character varying        | 100                      | NO          | null                         |                 |
| leads          | desafio_atual            | character varying        | 100                      | NO          | null                         |                 |
| leads          | inicio_evolucao          | character varying        | 50                       | NO          | null                         |                 |
| leads          | utm_source               | character varying        | 255                      | YES         | null                         |                 |
| leads          | utm_medium               | character varying        | 255                      | YES         | null                         |                 |
| leads          | utm_campaign             | character varying        | 255                      | YES         | null                         |                 |
| leads          | utm_term                 | character varying        | 255                      | YES         | null                         |                 |
| leads          | utm_content              | character varying        | 255                      | YES         | null                         |                 |
| leads          | referrer                 | text                     | null                     | YES         | null                         |                 |
| leads          | user_agent               | text                     | null                     | YES         | null                         |                 |
| leads          | ip_address               | inet                     | null                     | YES         | null                         |                 |
| leads          | status                   | character varying        | 50                       | NO          | 'novo'::character varying    |                 |
| leads          | tags                     | ARRAY                    | null                     | YES         | null                         |                 |
| leads          | score                    | integer                  | null                     | YES         | 0                            |                 |
| leads          | first_contact_at         | timestamp with time zone | null                     | YES         | null                         |                 |
| leads          | qualified_at             | timestamp with time zone | null                     | YES         | null                         |                 |
| leads          | converted_at             | timestamp with time zone | null                     | YES         | null                         |                 |
| profiles       | user_id                  | uuid                     | null                     | NO          | null                         | FK              |
| profiles       | user_id                  | uuid                     | null                     | NO          | null                         | PK              |
| profiles       | name                     | text                     | null                     | YES         | null                         |                 |
| profiles       | role                     | text                     | null                     | NO          | 'cliente'::text              |                 |
| profiles       | phone                    | text                     | null                     | YES         | null                         |                 |
| profiles       | created_at               | timestamp with time zone | null                     | YES         | now()                        |                 |
| profiles       | updated_at               | timestamp with time zone | null                     | YES         | now()                        |                 |
| subscriptions  | id                       | uuid                     | null                     | NO          | gen_random_uuid()            | PK              |
| subscriptions  | user_id                  | uuid                     | null                     | YES         | null                         | FK              |
| subscriptions  | plan_name                | text                     | null                     | YES         | null                         |                 |
| subscriptions  | status                   | text                     | null                     | YES         | null                         |                 |
| subscriptions  | start_date               | timestamp with time zone | null                     | YES         | null                         |                 |
| subscriptions  | end_date                 | timestamp with time zone | null                     | YES         | null                         |                 |
| subscriptions  | monthly_price            | numeric                  | null                     | YES         | null                         |                 |
| subscriptions  | created_at               | timestamp with time zone | null                     | YES         | now()                        |                 |
| subscriptions  | updated_at               | timestamp with time zone | null                     | YES         | now()                        |                 |
| system_metrics | id                       | uuid                     | null                     | NO          | gen_random_uuid()            | PK              |
| system_metrics | date                     | date                     | null                     | NO          | null                         |                 |
| system_metrics | total_users              | integer                  | null                     | YES         | null                         |                 |
| system_metrics | total_gestores           | integer                  | null                     | YES         | null                         |                 |
| system_metrics | total_clientes           | integer                  | null                     | YES         | null                         |                 |
| system_metrics | active_subscriptions     | integer                  | null                     | YES         | null                         |                 |
| system_metrics | mrr                      | numeric                  | null                     | YES         | null                         |                 |
| system_metrics | churn_rate               | numeric                  | null                     | YES         | null                         |                 |
| system_metrics | total_milhas_gerenciadas | bigint                   | null                     | YES         | null                         |                 |
| system_metrics | created_at               | timestamp with time zone | null                     | YES         | now()                        |                 |
| transactions   | id                       | uuid                     | null                     | NO          | gen_random_uuid()            | PK              |
| transactions   | account_id               | uuid                     | null                     | NO          | null                         | FK              |
| transactions   | type                     | text                     | null                     | NO          | null                         |                 |
| transactions   | points                   | bigint                   | null                     | NO          | null                         |                 |
| transactions   | date                     | date                     | null                     | NO          | null                         |                 |
| transactions   | description              | text                     | null                     | YES         | null                         |                 |
| transactions   | created_at               | timestamp with time zone | null                     | YES         | now()                        |                 |