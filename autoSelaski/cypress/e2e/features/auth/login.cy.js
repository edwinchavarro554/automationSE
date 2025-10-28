import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import users from '../../../fixtures/users.json';

describe('Escenarios login con usuarios primario y secundario', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  it('Login Correcto Con credenciales validas', () => {
    loginPage.visitLogin();
    cy.wait(3000);
    
    loginPage.login(users.validUser.email, users.validUser.password);
    cy.wait(5000);
  });

  it('Login fallido por password Incorrecta', () => {
    loginPage.visitLogin();
    cy.wait(3000);
    
    loginPage.login(users.validUser.email, users.invalidUser.password);
    cy.wait(3000);
    
    cy.contains('No se ha podido iniciar sesión', { timeout: 10000 }).should('be.visible');
  });

  it('Login fallido por email Incorrecto', () => {
    loginPage.visitLogin();
    cy.wait(3000);
    
    loginPage.login(users.invalidUser.email, users.validUser.password);
    cy.wait(3000);
    
    cy.contains('No se ha podido iniciar sesión', { timeout: 10000 }).should('be.visible');
  });

  it('Recuperar contraseña con email válido', () => {
    loginPage.visitLogin();
    cy.wait(3000);
    
    loginPage.clickOlvidastePassword();
    cy.wait(2000);
    
    loginPage.ingresarEmailRecuperacion(users.validUser.email);
    cy.wait(2000);
    
    loginPage.clickSolicitar();
    cy.wait(3000);
    
    loginPage.validarMensajeExitoRecuperacion();
  });

  it('Recuperar contraseña con email inválido', () => {
    loginPage.visitLogin();
    cy.wait(3000);
    
    loginPage.clickOlvidastePassword();
    cy.wait(2000);
    
    loginPage.ingresarEmailRecuperacion(users.invalidMailRecovery.email);
    cy.wait(2000);
    
    loginPage.clickSolicitar();
    cy.wait(3000);
    
    loginPage.validarMensajeErrorRecuperacion();
  });
});