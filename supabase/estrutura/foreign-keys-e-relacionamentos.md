| table_name    | column_name | foreign_table_name | foreign_column_name | constraint_name              |
| ------------- | ----------- | ------------------ | ------------------- | ---------------------------- |
| accounts      | client_id   | clients            | id                  | accounts_client_id_fkey      |
| clients       | gestor_id   | profiles           | user_id             | clients_gestor_id_fkey       |
| subscriptions | user_id     | profiles           | user_id             | subscriptions_user_id_fkey   |
| transactions  | account_id  | accounts           | id                  | transactions_account_id_fkey |