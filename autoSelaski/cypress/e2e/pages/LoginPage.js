import BasePage from './BasePage';

export default class LoginPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      emailInput: '#Email',
      passwordInput: '#Password',
      loginButton: 'div:contains("Ingresar")',
      olvidastePasswordLink: 'p.text-\\[\\#B8BFC9\\].cursor-pointer',
      ingresarMailRecuperacion: '#Email',
      btnSolicitar: '//div[normalize-space(text())="Solicitar"]',
      messageErrorRecovery: 'div.toast-title[aria-label="Email no valido"]',
      messageExitoRecuperacion: 'div.toast-message[aria-label="Si tu cuenta existe, se ha enviado un email de recuperación"]'
    };
  }

  visitLogin() {
    this.visit('/login');
  }

  login(email, password) {
    this.type(this.selectors.emailInput, email);
    this.type(this.selectors.passwordInput, password);
    cy.contains(this.selectors.loginButton, 'Ingresar').click();
  }

  clickOlvidastePassword() {
    cy.get(this.selectors.olvidastePasswordLink).click();
  }
  ingresarEmailRecuperacion(email) {
    this.type(this.selectors.ingresarMailRecuperacion, email);
    cy.contains('Recuperar').click();
  }
  clickSolicitar() {
    cy.xpath(this.selectors.btnSolicitar).click();
  }
    validarMensajeErrorRecuperacion() {
    cy.get(this.selectors.messageErrorRecovery)
      .should('be.visible')
      .then($toast => {
        cy.wrap($toast)
          .parent() // Si el mensaje está en un hijo, ajusta aquí
          .find('.toast-message')
          .should('contain.text', 'Verifique los datos');
      });
  }
  validarMensajeExitoRecuperacion() {
    cy.get(this.selectors.messageExitoRecuperacion)
      .should('be.visible')
      .then($toast => {
        cy.wrap($toast)
          .parent() // Si el mensaje está en un hijo, ajusta aquí
          .find('.toast-message')
          .should('contain.text', 'Si tu cuenta existe, se ha enviado un email de recuperación');
      });

}
}
