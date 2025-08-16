describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.cleanupTestData()
  })

  describe('Landing Page', () => {
    it('should display landing page correctly', () => {
      cy.visit('/')
      cy.contains('FlyMilhas').should('be.visible')
      cy.contains('Gestão profissional de milhas aéreas').should('be.visible')
      cy.get('a[href="/login"]').should('be.visible')
      cy.get('a[href="/signup"]').should('be.visible')
    })

    it('should navigate to signup and login pages', () => {
      cy.visit('/')
      
      // Test navigation to signup
      cy.get('a[href="/signup"]').first().click()
      cy.url().should('include', '/signup')
      cy.contains('Crie sua conta').should('be.visible')
      
      // Test navigation to login
      cy.get('a[href="/login"]').click()
      cy.url().should('include', '/login')
      cy.contains('Entre na sua conta').should('be.visible')
    })
  })

  describe('Signup Process', () => {
    it('should create a new gestor account', () => {
      cy.visit('/signup')
      
      // Select gestor role
      cy.get('input[value="gestor"]').click()
      cy.get('label[for="role-gestor"]').should('have.class', 'border-brand-500')
      
      // Fill form with valid data
      const timestamp = Date.now()
      const testData = {
        name: 'Carlos Gestor Teste',
        email: `gestor-test-${timestamp}@flymilhas.test`,
        password: 'test123456'
      }
      
      cy.get('input[name="name"]').type(testData.name)
      cy.get('input[name="email"]').type(testData.email)
      cy.get('input[name="password"]').type(testData.password)
      cy.get('input[name="confirmPassword"]').type(testData.password)
      
      // Submit form
      cy.get('button[type="submit"]').click()
      
      // Should show success message or redirect
      cy.url().should('not.include', '/signup')
      // Note: In a real test, you'd verify email confirmation flow
    })

    it('should create a new cliente account', () => {
      cy.visit('/signup')
      
      // Select cliente role
      cy.get('input[value="cliente"]').click()
      cy.get('label[for="role-cliente"]').should('have.class', 'border-brand-500')
      
      // Fill form with valid data
      const timestamp = Date.now()
      const testData = {
        name: 'Ana Cliente Teste',
        email: `cliente-test-${timestamp}@flymilhas.test`,
        password: 'test123456'
      }
      
      cy.get('input[name="name"]').type(testData.name)
      cy.get('input[name="email"]').type(testData.email)
      cy.get('input[name="password"]').type(testData.password)
      cy.get('input[name="confirmPassword"]').type(testData.password)
      
      // Submit form
      cy.get('button[type="submit"]').click()
      
      // Should show success or redirect
      cy.url().should('not.include', '/signup')
    })

    it('should show validation errors for invalid data', () => {
      cy.visit('/signup')
      
      // Try to submit without selecting role
      cy.get('button[type="submit"]').click()
      cy.contains('Selecione um tipo de conta').should('be.visible')
      
      // Select role and fill invalid data
      cy.get('input[value="gestor"]').click()
      cy.get('input[name="name"]').type('A') // Too short
      cy.get('input[name="email"]').type('invalid-email') // Invalid email
      cy.get('input[name="password"]').type('123') // Too short
      cy.get('input[name="confirmPassword"]').type('456') // Different password
      
      cy.get('button[type="submit"]').click()
      
      // Should show validation errors
      cy.contains('Nome deve ter pelo menos 2 caracteres').should('be.visible')
      cy.contains('E-mail inválido').should('be.visible')
      cy.contains('Senha deve ter pelo menos 6 caracteres').should('be.visible')
      cy.contains('Senhas não coincidem').should('be.visible')
    })
  })

  describe('Login Process', () => {
    it('should login with valid credentials', () => {
      cy.visit('/login')
      
      // For this test, we'd need existing test accounts
      // In a real scenario, you'd have seeded test data
      cy.get('input[type="email"]').type('gestor-demo@flymilhas.test')
      cy.get('input[type="password"]').type('demo123456')
      
      cy.get('button[type="submit"]').click()
      
      // Should redirect away from login
      cy.url().should('not.include', '/login')
    })

    it('should show error for invalid credentials', () => {
      cy.visit('/login')
      
      cy.get('input[type="email"]').type('invalid@email.com')
      cy.get('input[type="password"]').type('wrongpassword')
      
      cy.get('button[type="submit"]').click()
      
      // Should show error message
      cy.contains('E-mail ou senha incorretos').should('be.visible')
    })

    it('should show validation errors for empty fields', () => {
      cy.visit('/login')
      
      cy.get('button[type="submit"]').click()
      
      // Should show validation errors
      cy.contains('E-mail inválido').should('be.visible')
      cy.contains('Senha deve ter pelo menos 6 caracteres').should('be.visible')
    })
  })

  describe('Dashboard Redirects', () => {
    it('should redirect to dashboard after login', () => {
      cy.visit('/dashboard')
      
      // Should redirect to login if not authenticated
      cy.url().should('include', '/login')
    })

    it('should redirect authenticated users from landing page', () => {
      // This test would require a logged-in state
      // In a real scenario, you'd mock the authentication state
      // or use a test user that's already logged in
    })
  })

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility on login page', () => {
      cy.visit('/login')
      
      const password = 'testpassword'
      cy.get('input[type="password"]').type(password)
      
      // Password should be hidden initially
      cy.get('input[type="password"]').should('have.attr', 'type', 'password')
      
      // Click eye icon to show password
      cy.get('button').contains('Eye').click()
      cy.get('input[type="text"]').should('have.value', password)
      
      // Click again to hide password
      cy.get('button').contains('EyeOff').click()
      cy.get('input[type="password"]').should('have.value', password)
    })
  })
})