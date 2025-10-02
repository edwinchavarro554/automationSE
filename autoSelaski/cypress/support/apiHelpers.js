export const getApi = (endpoint) => {
  return cy.request({
    method: 'GET',
    url: endpoint
  });
};

export const postApi = (endpoint, body) => {
  return cy.request({
    method: 'POST',
    url: endpoint,
    body
  });
};
