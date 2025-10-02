import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import users from '../../../fixtures/users.json';


describe('Escenarios login con usuarios primario y secundario', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  it('Login Correcto Con credenciales validas ', () => {
    // Ir a la página de login
    loginPage.visitLogin();

    // Ingresar credenciales válidas y hacer login
    loginPage.login(users.validUser.email, users.validUser.password);

  });
  it('Login fallido por password Incorrecta', () => {
    // Ir a la página de login
    loginPage.visitLogin();

    // Ingresar credenciales inválidas y hacer login
    loginPage.login(users.validUser.email, users.invalidUser.password);

    // Validar que se muestra mensaje de error
    cy.contains('No se ha podido iniciar sesión').should('be.visible'); // Ajusta el texto según el mensaje real de tu aplicación
});
  it('Login fallido por email Incorrecto', () => {
    // Ir a la página de login
    loginPage.visitLogin(); 
    // Ingresar credenciales inválidas y hacer login
    loginPage.login(users.invalidUser.email, users.validUser.password); 
    // Validar que se muestra mensaje de error
    cy.contains('No se ha podido iniciar sesión').should('be.visible'); // Ajusta el texto según el mensaje real de tu aplicación
  });
  it('recuperar contraseña con email válido', () => {
    // Ir a la página de login
    loginPage.visitLogin();

    // Hacer clic en "¿Olvidaste tu contraseña?"
    loginPage.clickOlvidastePassword();
    // Ingresar un email válido
    loginPage.ingresarEmailRecuperacion(users.validUser.email);
    // Hacer clic en "Recuperar"
    loginPage.clickSolicitar();
    // Validar que se muestra mensaje de éxito
    loginPage.validarMensajeExitoRecuperacion();

    });

    it('recuperar contraseña con email inválido', () => {
      // Ir a la página de login
      loginPage.visitLogin();
      //Hacer clic en "¿Olvidaste tu contraseña?"
      loginPage.clickOlvidastePassword();
      // Ingresar un email inválido
      loginPage.ingresarEmailRecuperacion(users.invalidMailRecovery.email);
      // Hacer clic en "Recuperar"
      loginPage.clickSolicitar(); // Ajusta el texto según el mensaje real de tu aplicación
      // Validar que se muestra mensaje de error
      loginPage.validarMensajeErrorRecuperacion();
    });
  });

