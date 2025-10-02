import 'cypress-xpath';
import '@mmisty/cypress-allure-adapter/support';
import './commands';

// Hooks globales
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

afterEach(function () {
  if (this.currentTest.state === 'failed') {
    cy.screenshot(); // Solo esto, sin .attachment()
  }
});
