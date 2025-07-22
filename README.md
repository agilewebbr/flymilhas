# FlyMilhas Template

Um template HTML/CSS moderno e responsivo para SAAS de gestão de milhas aéreas, desenvolvido especificamente para integração com n8n como backend.

## 🚀 Características

- **100% HTML/CSS/JavaScript** - Sem frameworks pesados
- **Design Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- **Moderno e Profissional** - Interface limpa e intuitiva
- **Pronto para n8n** - Estruturado para fácil integração com workflows
- **Componentes Reutilizáveis** - Sistema de design consistente
- **Animações Suaves** - Micro-interações que melhoram a experiência
- **Acessibilidade** - Seguindo boas práticas de UX/UI

## 📁 Estrutura do Projeto

```
flymilhas-template/
├── css/
│   ├── base.css          # Variáveis, reset e utilitários
│   ├── components.css    # Componentes (botões, cards, forms)
│   ├── layout.css        # Layout principal (sidebar, header)
│   └── animations.css    # Animações e micro-interações
├── js/
│   └── app.js           # JavaScript principal
├── images/              # Imagens e assets
├── pages/               # Páginas adicionais (se necessário)
├── index.html           # Dashboard principal
├── login.html           # Página de login
├── milhas.html          # Gestão de milhas
├── transacoes.html      # Histórico de transações
├── perfil.html          # Configurações do usuário
├── PLANEJAMENTO.md      # Documento de planejamento
└── README.md            # Esta documentação
```

## 🎨 Páginas Incluídas

### 1. Login (login.html)
- Formulário de autenticação
- Design moderno com gradiente
- Login social (Google)
- Responsivo para mobile
- Validação de formulário

### 2. Dashboard (index.html)
- Visão geral das milhas
- Cards estatísticos
- Gráfico de evolução (placeholder)
- Atividade recente
- Ações rápidas
- Sidebar de navegação

### 3. Gestão de Milhas (milhas.html)
- Cards por companhia aérea
- Saldos e vencimentos
- Status das contas
- Ações por programa
- Resumo consolidado

### 4. Transações (transacoes.html)
- Histórico completo
- Filtros avançados
- Tabela responsiva
- Paginação
- Exportação de dados
- Status das transações

### 5. Perfil (perfil.html)
- Informações pessoais
- Configurações de segurança
- Preferências de notificação
- Configurações do sistema
- Zona de perigo (exclusão de conta)

## 🎯 Paleta de Cores

```css
/* Cores Principais */
--primary: #2563eb        /* Azul aviação */
--primary-dark: #1e40af   /* Azul escuro */
--secondary: #6366f1      /* Roxo */

/* Cores de Status */
--success: #10b981        /* Verde */
--warning: #f59e0b        /* Amarelo */
--error: #ef4444          /* Vermelho */
--info: #06b6d4           /* Ciano */

/* Cores Neutras */
--gray-50 a --gray-900    /* Escala de cinzas */
--bg-primary: #ffffff     /* Fundo principal */
--bg-secondary: #f8fafc   /* Fundo secundário */
```

## 🧩 Componentes Principais

### Botões
```html
<button class="btn btn-primary">Primário</button>
<button class="btn btn-secondary">Secundário</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-sm">Pequeno</button>
<button class="btn btn-lg">Grande</button>
```

### Cards
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Título</h3>
  </div>
  <div class="card-body">
    Conteúdo do card
  </div>
</div>
```

### Formulários
```html
<div class="form-group">
  <label class="form-label">Label</label>
  <input type="text" class="form-input" placeholder="Placeholder">
</div>
```

### Badges
```html
<span class="badge badge-primary">Primário</span>
<span class="badge badge-success">Sucesso</span>
<span class="badge badge-warning">Aviso</span>
```

## 📱 Responsividade

O template é totalmente responsivo com breakpoints:

- **Desktop**: > 768px
- **Tablet**: 481px - 768px  
- **Mobile**: ≤ 480px

### Características Responsivas:
- Sidebar colapsável em mobile
- Grid adaptativo
- Tabelas com scroll horizontal
- Formulários empilhados
- Navegação touch-friendly

## ⚡ JavaScript Features

### Funcionalidades Principais:
- Gerenciamento de sidebar
- Sistema de notificações
- Validação de formulários
- Animações de scroll
- Tooltips e dropdowns
- Modais
- Debounce para pesquisa
- Formatação de números/datas

### Uso Básico:
```javascript
// Mostrar notificação
FlyMilhas.showNotification('Sucesso!', 'success');

// Alternar sidebar
FlyMilhas.toggleSidebar();

// Formatar número
FlyMilhas.formatNumber(127450); // "127.450"
```

## 🔗 Integração com n8n

### Pontos de Integração Identificados:

#### 1. Autenticação (login.html)
```javascript
// Endpoint para login
POST /api/auth/login
{
  "email": "user@email.com",
  "password": "password"
}
```

#### 2. Dashboard (index.html)
```javascript
// Buscar estatísticas
GET /api/dashboard/stats

// Buscar atividade recente
GET /api/dashboard/activity
```

#### 3. Milhas (milhas.html)
```javascript
// Listar programas de milhas
GET /api/miles/programs

// Adicionar programa
POST /api/miles/programs
{
  "airline": "TAM",
  "account": "123456789",
  "balance": 45230
}
```

#### 4. Transações (transacoes.html)
```javascript
// Listar transações
GET /api/transactions?page=1&limit=10&filter={}

// Exportar transações
GET /api/transactions/export?format=csv
```

#### 5. Perfil (perfil.html)
```javascript
// Atualizar perfil
PUT /api/user/profile
{
  "name": "João Silva",
  "email": "joao@email.com"
}

// Alterar senha
PUT /api/user/password
{
  "currentPassword": "old",
  "newPassword": "new"
}
```

### Configuração de Webhooks n8n:

1. **Criar workflows** para cada endpoint
2. **Configurar HTTP Request nodes** para receber dados
3. **Implementar validação** de dados
4. **Conectar com banco de dados** (PostgreSQL, MySQL, etc.)
5. **Configurar notificações** (email, SMS)
6. **Implementar autenticação** JWT

## 🛠️ Customização

### Alterando Cores:
Edite as variáveis CSS em `css/base.css`:

```css
:root {
  --primary: #sua-cor-aqui;
  --secondary: #sua-cor-aqui;
}
```

### Adicionando Páginas:
1. Copie uma página existente
2. Atualize o título e conteúdo
3. Adicione link na sidebar
4. Inclua scripts necessários

### Modificando Layout:
- **Sidebar**: Edite `css/layout.css`
- **Componentes**: Modifique `css/components.css`
- **Animações**: Ajuste `css/animations.css`

## 🚀 Como Usar

### 1. Configuração Básica:
```bash
# Clone ou baixe os arquivos
# Abra index.html em um servidor web local
# Ou use um servidor simples:
python -m http.server 8000
```

### 2. Integração com n8n:
1. Configure os workflows no n8n
2. Atualize as URLs da API em `js/app.js`
3. Implemente autenticação
4. Teste todas as funcionalidades

### 3. Deploy:
- **Hospedagem estática**: Netlify, Vercel, GitHub Pages
- **Servidor web**: Apache, Nginx
- **CDN**: CloudFlare, AWS CloudFront

## 📋 Checklist de Implementação

### Frontend (Concluído ✅)
- [x] Design responsivo
- [x] Páginas principais
- [x] Componentes reutilizáveis
- [x] JavaScript interativo
- [x] Animações e micro-interações
- [x] Validação de formulários
- [x] Sistema de notificações

### Backend (Para implementar com n8n)
- [ ] Autenticação JWT
- [ ] CRUD de usuários
- [ ] Gestão de programas de milhas
- [ ] Histórico de transações
- [ ] Sistema de notificações
- [ ] Exportação de dados
- [ ] API de estatísticas

### Integrações
- [ ] Webhooks n8n
- [ ] Banco de dados
- [ ] Email/SMS
- [ ] APIs de companhias aéreas
- [ ] Sistema de backup
- [ ] Monitoramento

## 🔧 Troubleshooting

### Problemas Comuns:

1. **Sidebar não abre no mobile**
   - Verifique se o JavaScript está carregado
   - Confirme se os IDs estão corretos

2. **Estilos não aplicados**
   - Verifique a ordem dos arquivos CSS
   - Confirme se os caminhos estão corretos

3. **Formulários não funcionam**
   - Verifique se o JavaScript está ativo
   - Confirme se os event listeners estão configurados

## 📞 Suporte

Para dúvidas sobre implementação ou customização:

1. Consulte a documentação do n8n
2. Verifique os comentários no código
3. Teste em diferentes navegadores
4. Use as ferramentas de desenvolvedor do browser

## 📄 Licença

Este template foi desenvolvido especificamente para o projeto FlyMilhas e pode ser usado e modificado conforme necessário.

---

**Desenvolvido com ❤️ para facilitar a criação do seu MVP FlyMilhas**

