export default class BasePage {
  visit(path = '/') {
    cy.visit(path); // Cypress usará automáticamente el baseUrl configurado
  }

  type(selector, text) {
    cy.get(selector).clear().type(text);
  }
}
