// Intercept para stubs o mocks
export const interceptLogin = () => {
  cy.intercept('POST', '/api/login', (req) => {
    req.reply((res) => {
      res.send({ statusCode: 200, body: { token: 'fake-jwt-token' } });
    });
  }).as('loginRequest');
};
