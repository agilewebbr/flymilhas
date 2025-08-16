/// <reference types="cypress" />

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  
  // Wait for redirect after successful login
  cy.url().should('not.include', '/login')
})

// Custom command to create test user
Cypress.Commands.add('createTestUser', (role: 'gestor' | 'cliente', name: string) => {
  const timestamp = Date.now()
  const email = `test-${role}-${timestamp}@flymilhas.test`
  const password = 'test123456'

  cy.visit('/signup')
  
  // Select role
  cy.get(`input[value="${role}"]`).click()
  
  // Fill form
  cy.get('input[name="name"]').type(name)
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('input[name="confirmPassword"]').type(password)
  
  // Submit form
  cy.get('button[type="submit"]').click()
  
  // Wait for success or redirect
  cy.url().should('not.include', '/signup')
  
  return cy.wrap({ email, password })
})

// Custom command to cleanup test data
Cypress.Commands.add('cleanupTestData', () => {
  // This would typically involve API calls to clean up test data
  // For now, we'll just ensure we're logged out
  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
  
  // Clear cookies
  cy.clearCookies()
  
  // Visit home page to reset state
  cy.visit('/')
})

// Add more custom commands as needed for FlyMilhas testing

// Example: Command to add test data
Cypress.Commands.add('addTestClient', (gestorEmail: string, clientData: any) => {
  // This would make API calls to add test clients
  // Implementation depends on your API structure
})

// Example: Command to verify dashboard elements
Cypress.Commands.add('verifyDashboardElements', (role: 'gestor' | 'cliente' | 'admin') => {
  // Verify common dashboard elements based on role
  cy.get('[data-testid="dashboard-header"]').should('be.visible')
  
  if (role === 'gestor') {
    cy.get('[data-testid="clients-section"]').should('be.visible')
    cy.get('[data-testid="kpi-cards"]').should('be.visible')
  } else if (role === 'cliente') {
    cy.get('[data-testid="my-accounts"]').should('be.visible')
    cy.get('[data-testid="balance-charts"]').should('be.visible')
  } else if (role === 'admin') {
    cy.get('[data-testid="admin-metrics"]').should('be.visible')
    cy.get('[data-testid="system-overview"]').should('be.visible')
  }
})