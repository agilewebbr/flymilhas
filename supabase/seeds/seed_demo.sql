-- Seeds para demonstração do FlyMilhas
-- ATENÇÃO: Use UUIDs únicos e não inclua credenciais reais

-- Inserir profiles (assumindo que os usuários já foram criados via Supabase Auth)
-- Para demo, vamos criar UUIDs fictícios que devem ser substituídos pelos reais após signup

-- Admin user
INSERT INTO profiles (user_id, name, role, phone) VALUES 
('78c0509b-c77a-4159-be9b-557b7201382c', 'Admin FlyMilhas', 'admin', '+5511999999999');

-- Gestores
INSERT INTO profiles (user_id, name, role, phone) VALUES 
('22222222-2222-2222-2222-222222222222', 'Carlos Silva', 'gestor', '+5511888888888'),
('33333333-3333-3333-3333-333333333333', 'Maria Santos', 'gestor', '+5511777777777');

-- Clientes com login
INSERT INTO profiles (user_id, name, role, phone) VALUES 
('44444444-4444-4444-4444-444444444444', 'João Pedro', 'cliente', '+5511666666666'),
('55555555-5555-5555-5555-555555555555', 'Ana Costa', 'cliente', '+5511555555555');

-- Clientes gerenciados pelo gestor Carlos Silva
INSERT INTO clients (id, gestor_id, user_id, name, email, phone, notes) VALUES 
('c1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'João Pedro', 'joao.pedro@email.com', '+5511666666666', 'Cliente VIP - viaja muito a trabalho'),
('c2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', NULL, 'Roberto Lima', 'roberto.lima@email.com', '+5511123456789', 'Empresário, foco em viagens internacionais'),
('c3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', NULL, 'Fernanda Oliveira', 'fernanda.oliveira@email.com', '+5511987654321', 'Executiva, viaja para Europa frequentemente');

-- Clientes gerenciados pela gestora Maria Santos
INSERT INTO clients (id, gestor_id, user_id, name, email, phone, notes) VALUES 
('c4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Ana Costa', 'ana.costa@email.com', '+5511555555555', 'Advogada, prefere voos executivos'),
('c5555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', NULL, 'Pedro Martins', 'pedro.martins@email.com', '+5511444444444', 'Consultor, acumula milhas para lazer');

-- Contas de programas de fidelidade
-- Cliente João Pedro (gestor Carlos)
INSERT INTO accounts (id, client_id, program_name, account_number, current_balance) VALUES 
('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Smiles', '123456789', 85000),
('a2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Latam Pass', 'LP987654321', 42000),
('a3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Livelo', 'LV555666777', 28000);

-- Cliente Roberto Lima (gestor Carlos)
INSERT INTO accounts (id, client_id, program_name, account_number, current_balance) VALUES 
('a4444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222', 'Smiles', '111222333', 120000),
('a5555555-5555-5555-5555-555555555555', 'c2222222-2222-2222-2222-222222222222', 'Azul', 'AZ789123456', 67000);

-- Cliente Fernanda Oliveira (gestor Carlos)
INSERT INTO accounts (id, client_id, program_name, account_number, current_balance) VALUES 
('a6666666-6666-6666-6666-666666666666', 'c3333333-3333-3333-3333-333333333333', 'Latam Pass', 'LP456789123', 95000),
('a7777777-7777-7777-7777-777777777777', 'c3333333-3333-3333-3333-333333333333', 'Esfera', 'ES999888777', 33000);

-- Cliente Ana Costa (gestora Maria)
INSERT INTO accounts (id, client_id, program_name, account_number, current_balance) VALUES 
('a8888888-8888-8888-8888-888888888888', 'c4444444-4444-4444-4444-444444444444', 'Smiles', '777888999', 76000),
('a9999999-9999-9999-9999-999999999999', 'c4444444-4444-4444-4444-444444444444', 'Livelo', 'LV333444555', 45000);

-- Cliente Pedro Martins (gestora Maria)
INSERT INTO accounts (id, client_id, program_name, account_number, current_balance) VALUES 
('a0000000-0000-0000-0000-000000000000', 'c5555555-5555-5555-5555-555555555555', 'Azul', 'AZ123456789', 58000);

-- Transações para criar histórico (últimos 6 meses)
-- João Pedro - Smiles
INSERT INTO transactions (account_id, type, points, date, description) VALUES 
('a1111111-1111-1111-1111-111111111111', 'acumulo', 15000, '2024-08-01', 'Voo São Paulo - Nova York'),
('a1111111-1111-1111-1111-111111111111', 'acumulo', 8000, '2024-07-15', 'Compras cartão de crédito'),
('a1111111-1111-1111-1111-111111111111', 'resgate', 25000, '2024-06-20', 'Resgate passagem Londres'),
('a1111111-1111-1111-1111-111111111111', 'acumulo', 12000, '2024-05-10', 'Voo Rio - Miami'),
('a1111111-1111-1111-1111-111111111111', 'acumulo', 20000, '2024-04-05', 'Promoção transferência pontos'),
('a1111111-1111-1111-1111-111111111111', 'acumulo', 25000, '2024-03-12', 'Voo executivo São Paulo - Paris');

-- João Pedro - Latam Pass
INSERT INTO transactions (account_id, type, points, date, description) VALUES 
('a2222222-2222-2222-2222-222222222222', 'acumulo', 18000, '2024-07-25', 'Voo São Paulo - Santiago'),
('a2222222-2222-2222-2222-222222222222', 'acumulo', 10000, '2024-06-30', 'Compras portal de milhas'),
('a2222222-2222-2222-2222-222222222222', 'acumulo', 14000, '2024-05-18', 'Voo Buenos Aires - Miami');

-- Roberto Lima - Smiles (cliente com mais movimento)
INSERT INTO transactions (account_id, type, points, date, description) VALUES 
('a4444444-4444-4444-4444-444444444444', 'acumulo', 35000, '2024-08-10', 'Voo primeira classe SP - Londres'),
('a4444444-4444-4444-4444-444444444444', 'acumulo', 22000, '2024-07-20', 'Compras parceiro Smiles'),
('a4444444-4444-4444-4444-444444444444', 'resgate', 45000, '2024-06-15', 'Resgate primeira classe Europa'),
('a4444444-4444-4444-4444-444444444444', 'acumulo', 28000, '2024-05-25', 'Voo executivo intercontinental'),
('a4444444-4444-4444-4444-444444444444', 'acumulo', 15000, '2024-04-18', 'Transferência de pontos'),
('a4444444-4444-4444-4444-444444444444', 'acumulo', 40000, '2024-03-22', 'Promoção dobro de milhas'),
('a4444444-4444-4444-4444-444444444444', 'acumulo', 25000, '2024-02-28', 'Voo São Paulo - Tóquio');

-- Ana Costa - Smiles
INSERT INTO transactions (account_id, type, points, date, description) VALUES 
('a8888888-8888-8888-8888-888888888888', 'acumulo', 16000, '2024-08-05', 'Voo executivo doméstico'),
('a8888888-8888-8888-8888-888888888888', 'acumulo', 12000, '2024-07-12', 'Compras cartão Smiles'),
('a8888888-8888-8888-8888-888888888888', 'resgate', 20000, '2024-06-08', 'Upgrade classe executiva'),
('a8888888-8888-8888-8888-888888888888', 'acumulo', 18000, '2024-05-15', 'Voo internacional trabalho'),
('a8888888-8888-8888-8888-888888888888', 'acumulo', 25000, '2024-04-20', 'Promoção parceiros'),
('a8888888-8888-8888-8888-888888888888', 'acumulo', 22000, '2024-03-10', 'Voo longo curso'),
('a8888888-8888-8888-8888-888888888888', 'acumulo', 23000, '2024-02-14', 'Transferência pontos hotel');

-- Subscriptions para métricas
INSERT INTO subscriptions (user_id, plan_name, status, start_date, monthly_price) VALUES 
('22222222-2222-2222-2222-222222222222', 'Business', 'active', '2024-01-15', 99.90),
('33333333-3333-3333-3333-333333333333', 'Economy', 'active', '2024-02-01', 49.90);

-- System metrics snapshot (exemplo dos últimos 30 dias)
INSERT INTO system_metrics (date, total_users, total_gestores, total_clientes, active_subscriptions, mrr, churn_rate, total_milhas_gerenciadas) VALUES 
('2024-08-15', 7, 2, 5, 2, 149.80, 0.05, 653000),
('2024-08-01', 7, 2, 5, 2, 149.80, 0.05, 642000),
('2024-07-15', 6, 2, 4, 2, 149.80, 0.10, 598000),
('2024-07-01', 5, 2, 3, 2, 149.80, 0.00, 545000);