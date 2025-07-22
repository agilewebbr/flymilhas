# Como Usar o Template FlyMilhas

## 🚀 Início Rápido

### 1. Servir os Arquivos
```bash
# Navegue até a pasta do template
cd flymilhas-template

# Inicie um servidor local
python3 -m http.server 8000

# Acesse no navegador
http://localhost:8000
```

### 2. Estrutura de Arquivos
- `login.html` - Página de autenticação
- `index.html` - Dashboard principal
- `milhas.html` - Gestão de programas de milhas
- `transacoes.html` - Histórico de transações
- `perfil.html` - Configurações do usuário

### 3. Integração com n8n

#### Endpoints Sugeridos:
```javascript
// Autenticação
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout

// Dashboard
GET /api/dashboard/stats
GET /api/dashboard/activity

// Milhas
GET /api/miles/programs
POST /api/miles/programs
PUT /api/miles/programs/:id
DELETE /api/miles/programs/:id

// Transações
GET /api/transactions
POST /api/transactions
GET /api/transactions/export

// Usuário
GET /api/user/profile
PUT /api/user/profile
PUT /api/user/password
```

#### Configuração no JavaScript:
1. Abra `js/app.js`
2. Localize o objeto `api`
3. Substitua as URLs pelos endpoints do n8n
4. Configure autenticação JWT se necessário

### 4. Personalização

#### Cores:
Edite `css/base.css` nas variáveis CSS:
```css
:root {
  --primary: #2563eb;
  --secondary: #6366f1;
  /* ... outras cores */
}
```

#### Logo:
Substitua o texto "FM" no header por sua logo:
```html
<div class="logo">
  <img src="sua-logo.png" alt="FlyMilhas">
</div>
```

#### Conteúdo:
- Textos estão em português brasileiro
- Fácil de localizar e alterar
- Estrutura semântica clara

### 5. Deploy

#### Opção 1: Hospedagem Estática
- Netlify, Vercel, GitHub Pages
- Apenas faça upload dos arquivos

#### Opção 2: Servidor Web
- Apache, Nginx
- Configure para servir arquivos estáticos

#### Opção 3: Integrado com Backend
- Coloque os arquivos na pasta static do seu backend
- Configure rotas para servir o frontend

### 6. Funcionalidades Prontas

✅ **Login/Logout** - Formulário funcional
✅ **Dashboard** - Cards estatísticos e gráficos
✅ **Gestão de Milhas** - CRUD de programas
✅ **Transações** - Listagem com filtros
✅ **Configurações** - Perfil e preferências
✅ **Responsivo** - Mobile, tablet, desktop
✅ **Animações** - Micro-interações suaves
✅ **Notificações** - Sistema de alertas
✅ **Validação** - Formulários com feedback

### 7. Próximos Passos

1. **Configure o n8n** com os workflows necessários
2. **Teste a integração** entre frontend e backend
3. **Customize** cores, logo e textos conforme sua marca
4. **Adicione funcionalidades** específicas do seu negócio
5. **Deploy** em produção

### 8. Suporte

- Consulte o `README.md` para documentação completa
- Verifique o `PLANEJAMENTO.md` para detalhes técnicos
- Use as ferramentas de desenvolvedor do navegador para debug

---

**Template criado especificamente para o FlyMilhas MVP** 🚀

