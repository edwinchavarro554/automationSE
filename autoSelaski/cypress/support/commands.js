import LoginPage from '../e2e/pages/LoginPage';
import users from '../fixtures/users.json';

/**
 * Login original:
 * flujo que intenta un login fallido y luego exitoso,
 * útil para pruebas de validación de login.
 */
Cypress.Commands.add('login', (userKey = 'validUser') => {
  const user = users[userKey];
  const loginPage = new LoginPage();
  
  loginPage.visitLogin();
  loginPage.loginFailThenSuccess(user.email, user.password); // tu flujo original
});

/**
 * Login persistente:
 * para tests que requieren sesión activa sin logout.
 * Mantiene la sesión abierta y asegura que se redirige al dashboard.
 */
Cypress.Commands.add('loginPersistent', (userKey = 'validUser') => {
  const user = users[userKey];
  const loginPage = new LoginPage();

  loginPage.visitLogin();
  loginPage.login(user.email, user.password); // login limpio y exitoso

  // Verificación de que la sesión se mantuvo abierta
  cy.url().should('include', '/dashboard');

  // Opcional: guardar cookies o localStorage para reutilizar sesión
  // cy.saveSession(); // si implementas un helper de persistencia
});
