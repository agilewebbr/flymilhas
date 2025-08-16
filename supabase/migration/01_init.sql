-- Extensões
create extension if not exists "pgcrypto";

-- profiles (vinculado a auth.users)
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'cliente', -- values: 'admin','gestor','cliente'
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- clients
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  gestor_id uuid not null references profiles(user_id) on delete cascade,
  user_id uuid references auth.users(id), -- opcional, se cliente tiver login
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- accounts (programas de fidelidade)
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  program_name text not null, -- ex: 'Smiles','Latam Pass','Azul','Livelo','Esfera','Outro'
  account_number text,
  current_balance bigint default 0,
  currency text default 'points',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- transactions (acúmulos/resgates)
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  type text not null check (type in ('acumulo','resgate')),
  points bigint not null check (points >= 0),
  date date not null,
  description text,
  created_at timestamptz default now()
);

-- subscriptions (para métricas/planos)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(user_id),
  plan_name text, -- 'Free','Economy','Business','First Class'
  status text, -- 'active','canceled','trialing'
  start_date timestamptz,
  end_date timestamptz,
  monthly_price numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- system_metrics (opcional snapshots diários)
create table if not exists system_metrics (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  total_users int,
  total_gestores int,
  total_clientes int,
  active_subscriptions int,
  mrr numeric,
  churn_rate numeric,
  total_milhas_gerenciadas bigint,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_transactions_account_date on transactions(account_id, date);
create index if not exists idx_accounts_client on accounts(client_id);

-- Trigger function para manter current_balance
create or replace function fn_update_account_balance() returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    if (NEW.type = 'acumulo') then
      update accounts set current_balance = current_balance + NEW.points, updated_at = now() where id = NEW.account_id;
    else
      update accounts set current_balance = current_balance - NEW.points, updated_at = now() where id = NEW.account_id;
    end if;
    return NEW;
  elsif (TG_OP = 'UPDATE') then
    -- revert old
    if (OLD.type = 'acumulo') then
      update accounts set current_balance = current_balance - OLD.points where id = OLD.account_id;
    else
      update accounts set current_balance = current_balance + OLD.points where id = OLD.account_id;
    end if;
    -- apply new
    if (NEW.type = 'acumulo') then
      update accounts set current_balance = current_balance + NEW.points, updated_at = now() where id = NEW.account_id;
    else
      update accounts set current_balance = current_balance - NEW.points, updated_at = now() where id = NEW.account_id;
    end if;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    if (OLD.type = 'acumulo') then
      update accounts set current_balance = current_balance - OLD.points, updated_at = now() where id = OLD.account_id;
    else
      update accounts set current_balance = current_balance + OLD.points, updated_at = now() where id = OLD.account_id;
    end if;
    return OLD;
  end if;
  return NULL;
end;
$$ language plpgsql;

create trigger trg_transactions_balance
  after insert or update or delete on transactions
  for each row execute function fn_update_account_balance();

-- Ativar RLS
alter table profiles enable row level security;
alter table clients enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table subscriptions enable row level security;
alter table system_metrics enable row level security;

-- Policies: profiles (users podem ver/editar seu próprio profile)
create policy profiles_select_self on profiles for select using (user_id = auth.uid() OR (exists(select 1 from profiles p2 where p2.role = 'admin' and p2.user_id = auth.uid())));
create policy profiles_update_self on profiles for update using (user_id = auth.uid());
create policy profiles_insert_auth on profiles for insert with check (user_id = auth.uid());

-- Clients: gestores gerenciam seus clients; clientes com user_id podem ver seu client; admins veem tudo
create policy clients_gestor_full on clients for all using (
  (gestor_id = auth.uid()) OR
  (exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')) OR
  (user_id = auth.uid())
) with check (
  (gestor_id = auth.uid()) OR
  (exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin'))
);

-- Accounts: acesso se pertence a cliente cujo gestor é auth.uid(), ou cliente dono, ou admin
create policy accounts_access on accounts for all using (
  exists (select 1 from clients c where c.id = accounts.client_id and (c.gestor_id = auth.uid() OR c.user_id = auth.uid())) OR
  (exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin'))
) with check (
  exists (select 1 from clients c where c.id = accounts.client_id and c.gestor_id = auth.uid()) OR
  (exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin'))
);

-- Transactions:
create policy transactions_access on transactions for all using (
  exists (select 1 from accounts a join clients c on a.client_id = c.id where a.id = transactions.account_id and (c.gestor_id = auth.uid() OR c.user_id = auth.uid())) OR
  (exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin'))
) with check (
  exists (select 1 from accounts a join clients c on a.client_id = c.id where a.id = transactions.account_id and c.gestor_id = auth.uid()) OR
  (exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin'))
);

-- Subscriptions: admin pode ler tudo; usuarios leem suas subscriptions
create policy subscriptions_access on subscriptions for select using (
  user_id = auth.uid() OR (exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin'))
);
create policy subscriptions_manage on subscriptions for all using (
  exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
);

-- system_metrics: leitura permitida a admins e rotinas server-side (anon não)
create policy system_metrics_select_admin on system_metrics for select using (
  exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
);