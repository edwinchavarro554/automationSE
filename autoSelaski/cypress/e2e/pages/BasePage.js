// Archivo: cypress/e2e/pages/BasePage.js
// Descripción: Clase base para páginas con métodos comunes
// Autor: Equipo QA Automation
// ============================
// ============================
export default class BasePage {
  visit(path = '/') {
    cy.visit(path); 
  }

  type(selector, text) {
    cy.get(selector).clear().type(text);
  }
}
