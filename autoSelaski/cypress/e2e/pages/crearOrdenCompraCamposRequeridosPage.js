// ============================
// Archivo: crearOrdenCompraCamposRequeridosPage.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Page Object para la creación de Orden de Compra con solo campos requeridos
// ============================

class CrearOrdenCompraCamposRequeridosPage {

  // ================= HELPERS =================

  clickImportacion() {
    cy.get('#mobile-menu-toggler').click({ force: true });
    cy.contains('div.side-menu__title.arrow', 'Importación').click({ force: true });
    cy.get('ul.menu__sub-open.ml-4', { timeout: 10000 }).should('be.visible');
  }

  clickCrearOrdenCompra() {
    cy.contains('div.side-menu__title', 'Crear Orden de Compra', { timeout: 10000 })
      .click({ force: true });
  }

  selectTagEmpresa() {
    cy.get('select[formcontrolname="IdTag"]', { timeout: 10000 })
      .should('be.visible')
      .should('not.be.disabled');

    cy.get('select[formcontrolname="IdTag"] option')
      .contains('General', { timeout: 10000 })
      .should('exist');

    cy.get('select[formcontrolname="IdTag"]')
      .select('General')
      .should('have.value', '460');
  }

  fillOrderForm(order) {
    // Nº O.C *
    cy.get('input[formcontrolname="OrderNumber"]')
      .should('be.visible')
      .clear()
      .type(order.number, { force: true });

    // Valor Total O.C. *
    cy.get('input[formcontrolname="TotalValue"]')
      .should('be.visible')
      .clear()
      .type(order.totalValue, { force: true });

    // Empresa *
    cy.get('select[formcontrolname="IdBusiness"]')
      .should('be.visible')
      .select(order.company);

    // Incoterm *
    cy.get('select[formcontrolname="IdIncoterm"]')
      .should('be.visible')
      .select(order.incoterm);

    // Tag empresa *
    this.selectTagEmpresa();

    // Orden Fraccionada *
    if (order.fractionada) {
      cy.get('#fracionada-si').check({ force: true });
    } else {
      cy.get('#fracionada-no').check({ force: true });
    }
  }

  saveOrder() {
    cy.contains('button', 'Guardar', { timeout: 10000 })
      .scrollIntoView({ block: 'center' })
      .click({ force: true });
  }

  assertOrderCreated() {
    cy.contains('Orden Creada', { timeout: 20000 }).should('be.visible');
    cy.contains('Se ha creado la orden', { timeout: 20000 }).should('be.visible');
  }

  // Helper para obtener valores de incoterms
  getIncotermValue(incotermText) {
    const incotermMap = {
      'EXW': '1',
      'FCA': '2', 
      'FAS': '3',
      'FOB': '4',
      'CPT': '5',
      'CFR': '6',
      'CIF': '7',
      'CIP': '8',
      'DAP': '9',
      'DPU': '10',
      'DDP': '11'
    };
    return incotermMap[incotermText] || '4'; // Default FOB
  }
}

export default CrearOrdenCompraCamposRequeridosPage;