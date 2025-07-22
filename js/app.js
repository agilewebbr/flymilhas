// ==================== CONFIGURAÇÃO DE AMBIENTE ====================
const CONFIG = {
    development: {
        N8N_BASE_URL: 'http://localhost:5678/webhook',
        BASE_URL: 'http://localhost:3000'
    },
    production: {
        N8N_BASE_URL: 'https://n8n.agileweb.com.br/webhook',
        BASE_URL: window.location.origin
    }
};

// Detectar ambiente
const ENV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'development' 
    : 'production';

const API_CONFIG = CONFIG[ENV];

console.log(`🚀 FlyMilhas rodando em modo: ${ENV}`);
console.log(`🔗 API Base URL: ${API_CONFIG.N8N_BASE_URL}`);

// ==================== GERENCIAMENTO DE USUÁRIO ====================
class UserManager {
    constructor() {
        this.user = this.loadUser();
    }

    loadUser() {
        try {
            const userData = localStorage.getItem('flymilhas_user');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            return null;
        }
    }

    saveUser(userData) {
        try {
            this.user = {
                ...userData,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('flymilhas_user', JSON.stringify(this.user));
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados do usuário:', error);
            return false;
        }
    }

    clearUser() {
        this.user = null;
        localStorage.removeItem('flymilhas_user');
    }

    isAuthenticated() {
        return this.user !== null;
    }

    getCurrentUser() {
        return this.user;
    }
}

// ==================== SISTEMA DE NOTIFICAÇÕES ====================
class NotificationSystem {
    static show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" aria-label="Fechar">×</button>
        `;

        document.body.appendChild(notification);

        // Remover automaticamente
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);

        return notification;
    }

    static success(message) {
        return this.show(message, 'success');
    }

    static error(message) {
        return this.show(message, 'error');
    }

    static info(message) {
        return this.show(message, 'info');
    }
}

// ==================== CLASSE PRINCIPAL FLYMILHAS ====================
class FlyMilhasApp {
    constructor() {
        this.userManager = new UserManager();
        this.init();
    }

    init() {
        console.log('🎯 Inicializando FlyMilhas App...');
        this.checkAuthState();
        this.bindEvents();
        this.loadPageData();
        this.initSidebar();
        console.log('✅ FlyMilhas App inicializado com sucesso!');
    }

    // ==================== AUTENTICAÇÃO ====================
    checkAuthState() {
        const currentPage = this.getCurrentPage();
        const isLoginPage = currentPage === 'login.html';
        const isAuthenticated = this.userManager.isAuthenticated();
        
        console.log(`📄 Página atual: ${currentPage}`);
        console.log(`🔐 Usuário autenticado: ${isAuthenticated}`);

        if (!isAuthenticated && !isLoginPage) {
            console.log('❌ Usuário não autenticado, redirecionando para login...');
            window.location.href = '/login.html';
            return;
        }
        
        if (isAuthenticated && isLoginPage) {
            console.log('✅ Usuário já autenticado, redirecionando para dashboard...');
            window.location.href = '/';
            return;
        }

        // Atualizar interface com dados do usuário
        if (isAuthenticated) {
            this.updateUserInterface();
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html' || path === '') {
            return 'index.html';
        }
        return path.split('/').pop() || 'index.html';
    }

    updateUserInterface() {
        const user = this.userManager.getCurrentUser();
        if (!user) return;

        // Atualizar nome do usuário em todos os elementos
        const userNameElements = document.querySelectorAll('.user-name, [data-user-name]');
        userNameElements.forEach(el => {
            el.textContent = user.name || user.email.split('@')[0];
        });

        // Atualizar email do usuário
        const userEmailElements = document.querySelectorAll('.user-email, [data-user-email]');
        userEmailElements.forEach(el => {
            el.textContent = user.email;
        });

        console.log(`👤 Interface atualizada para: ${user.name || user.email}`);
    }

    // ==================== EVENTOS ====================
    bindEvents() {
        // Formulário de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            console.log('🔗 Event listener do login configurado');
        }

        // Botões de logout
        const logoutBtns = document.querySelectorAll('.logout-btn, [data-logout]');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleLogout(e));
        });
        if (logoutBtns.length > 0) {
            console.log(`🔗 ${logoutBtns.length} botões de logout configurados`);
        }

        // Navegação da sidebar
        this.bindNavigation();

        // Outros eventos específicos da página
        this.bindPageSpecificEvents();
    }

    bindNavigation() {
        const navLinks = document.querySelectorAll('.sidebar a[href], nav a[href]');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.startsWith('/') || href.endsWith('.html'))) {
                link.addEventListener('click', (e) => {
                    // Permitir navegação normal para arquivos HTML
                    console.log(`🔗 Navegando para: ${href}`);
                });
            }
        });
    }

    bindPageSpecificEvents() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'perfil.html':
                this.bindPerfilEvents();
                break;
            case 'milhas.html':
                this.bindMilhasEvents();
                break;
            case 'transacoes.html':
                this.bindTransacoesEvents();
                break;
        }
    }

    bindPerfilEvents() {
        const perfilForm = document.getElementById('perfilForm');
        if (perfilForm) {
            perfilForm.addEventListener('submit', (e) => this.handlePerfilUpdate(e));
        }
    }

    bindMilhasEvents() {
        const addMilhasBtn = document.querySelector('.add-milhas-btn');
        if (addMilhasBtn) {
            addMilhasBtn.addEventListener('click', () => this.showAddMilhasModal());
        }
    }

    bindTransacoesEvents() {
        const exportBtn = document.querySelector('.export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportTransacoes());
        }
    }

    // ==================== MANIPULADORES DE EVENTOS ====================
    async handleLogin(e) {
        e.preventDefault();
        console.log('🔐 Tentativa de login iniciada...');
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        const loginBtn = e.target.querySelector('button[type="submit"]');
        const originalText = loginBtn.textContent;
        
        try {
            // UI de loading
            this.setLoadingState(loginBtn, 'Entrando...');
            
            console.log(`📧 Email: ${email}`);
            console.log(`🌐 Endpoint: ${API_CONFIG.N8N_BASE_URL}/flymilhas_auth`);
            
            const response = await fetch(`${API_CONFIG.N8N_BASE_URL}/flymilhas_auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    action: 'login'
                })
            });

            console.log(`📡 Response status: ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📦 Response data:', data);
            
            if (data.success) {
                // Salvar dados do usuário
                const userData = {
                    id: data.user?.id || email,
                    email: data.user?.email || email,
                    name: data.user?.name || email.split('@')[0],
                    token: data.token || 'mock-token-' + Date.now()
                };
                
                if (this.userManager.saveUser(userData)) {
                    NotificationSystem.success('Login realizado com sucesso!');
                    console.log('✅ Login bem-sucedido, redirecionando...');
                    
                    // Redirecionar para dashboard
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                } else {
                    throw new Error('Erro ao salvar dados do usuário');
                }
                
            } else {
                throw new Error(data.message || 'Credenciais inválidas');
            }
            
        } catch (error) {
            console.error('❌ Erro no login:', error);
            NotificationSystem.error(error.message || 'Erro ao fazer login. Tente novamente.');
        } finally {
            this.setLoadingState(loginBtn, originalText, false);
        }
    }

    async handleLogout(e) {
        e.preventDefault();
        console.log('🚪 Logout iniciado...');
        
        try {
            const user = this.userManager.getCurrentUser();
            
            // Tentar notificar o servidor sobre logout
            if (user?.token) {
                try {
                    await fetch(`${API_CONFIG.N8N_BASE_URL}/flymilhas_auth`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        },
                        body: JSON.stringify({
                            action: 'logout'
                        })
                    });
                } catch (error) {
                    console.warn('⚠️ Erro ao notificar servidor sobre logout:', error);
                }
            }
        } finally {
            // Limpar dados locais sempre
            this.userManager.clearUser();
            NotificationSystem.info('Logout realizado com sucesso!');
            console.log('✅ Logout concluído, redirecionando...');
            
            // Redirecionar para login
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 500);
        }
    }

    // ==================== CARREGAMENTO DE DADOS ====================
    loadPageData() {
        const currentPage = this.getCurrentPage();
        console.log(`📊 Carregando dados da página: ${currentPage}`);
        
        switch (currentPage) {
            case 'index.html':
                this.loadDashboardData();
                break;
            case 'milhas.html':
                this.loadMilhasData();
                break;
            case 'transacoes.html':
                this.loadTransacoesData();
                break;
            case 'perfil.html':
                this.loadPerfilData();
                break;
        }
    }

    async loadDashboardData() {
        try {
            console.log('📈 Carregando dados do dashboard...');
            
            // Por enquanto, usar dados mock - depois integrar com N8N
            const stats = {
                totalMilhas: 125750,
                programasAtivos: 3,
                transacoesMes: 12,
                proximoVencimento: '2025-03-15'
            };
            
            this.updateDashboardStats(stats);
            console.log('✅ Dados do dashboard carregados');
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados do dashboard:', error);
            NotificationSystem.error('Erro ao carregar dados do dashboard');
        }
    }

    updateDashboardStats(stats) {
        const elements = {
            totalMilhas: document.querySelector('.total-milhas, [data-total-milhas]'),
            programasAtivos: document.querySelector('.programas-ativos, [data-programas-ativos]'),
            transacoesMes: document.querySelector('.transacoes-mes, [data-transacoes-mes]'),
            proximoVencimento: document.querySelector('.proximo-vencimento, [data-proximo-vencimento]')
        };

        if (elements.totalMilhas) {
            elements.totalMilhas.textContent = this.formatNumber(stats.totalMilhas);
        }
        if (elements.programasAtivos) {
            elements.programasAtivos.textContent = stats.programasAtivos;
        }
        if (elements.transacoesMes) {
            elements.transacoesMes.textContent = stats.transacoesMes;
        }
        if (elements.proximoVencimento) {
            elements.proximoVencimento.textContent = this.formatDate(stats.proximoVencimento);
        }
    }

    async loadMilhasData() {
        console.log('✈️ Carregando dados de milhas...');
        // Implementar integração com N8N
    }

    async loadTransacoesData() {
        console.log('💳 Carregando transações...');
        // Implementar integração com N8N
    }

    async loadPerfilData() {
        console.log('👤 Carregando dados do perfil...');
        
        const user = this.userManager.getCurrentUser();
        if (user) {
            // Preencher formulário com dados do usuário
            const emailInput = document.getElementById('email');
            const nomeInput = document.getElementById('nome');
            
            if (emailInput) emailInput.value = user.email;
            if (nomeInput) nomeInput.value = user.name || '';
            
            console.log('✅ Dados do perfil preenchidos');
        }
    }

    // ==================== SIDEBAR (mantendo sua lógica original) ====================
    initSidebar() {
        // Manter a lógica do seu sidebar original
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.querySelector('.sidebar-toggle');
        
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        // Auto-collapse em mobile
        if (window.innerWidth <= 768) {
            sidebar?.classList.add('collapsed');
        }
    }

    // ==================== UTILITÁRIOS ====================
    setLoadingState(button, text, loading = true) {
        if (loading) {
            button.disabled = true;
            button.textContent = text;
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    formatNumber(number) {
        return new Intl.NumberFormat('pt-BR').format(number);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // ==================== MÉTODOS ESPECÍFICOS ====================
    async handlePerfilUpdate(e) {
        e.preventDefault();
        console.log('👤 Atualizando perfil...');
        NotificationSystem.info('Funcionalidade em desenvolvimento...');
    }

    showAddMilhasModal() {
        console.log('✈️ Abrindo modal de adicionar milhas...');
        NotificationSystem.info('Modal de milhas em desenvolvimento...');
    }

    exportTransacoes() {
        console.log('📊 Exportando transações...');
        NotificationSystem.info('Exportação em desenvolvimento...');
    }
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado, inicializando FlyMilhas...');
    window.flyMilhasApp = new FlyMilhasApp();
});

// ==================== EXPORTAÇÕES GLOBAIS ====================
window.FlyMilhasApp = FlyMilhasApp;
window.UserManager = UserManager;
window.NotificationSystem = NotificationSystem;

// ==================== TRATAMENTO DE ERROS GLOBAIS ====================
window.addEventListener('error', (e) => {
    console.error('❌ Erro global capturado:', e.error);
    NotificationSystem.error('Ocorreu um erro inesperado');
});

console.log('🎯 FlyMilhas App carregado e pronto!');

// Adicionar após linha de salvamento no método handleLogin
console.log('💾 Tentando salvar no localStorage:', userData);
const saved = localStorage.setItem('flymilhas_user', JSON.stringify(userData));
console.log('✅ Dados salvos com sucesso');

// Verificar imediatamente se foi salvo
const check = localStorage.getItem('flymilhas_user');
console.log('🔍 Verificação imediata:', check ? '✅ Dados encontrados' : '❌ Dados não encontrados');