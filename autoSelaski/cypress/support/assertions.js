// Funciones de validación comunes
export const assertStatusCode = (response, code) => {
  expect(response.status).to.eq(code);
};

export const assertContainsText = (selector, text) => {
  cy.get(selector).should('contain.text', text);
};
