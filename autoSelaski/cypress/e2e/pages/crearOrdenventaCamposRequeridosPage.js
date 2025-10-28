// ============================
// Archivo: crearOrdenVentaCamposRequeridosPage.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Page Object para creación de órdenes de venta solo con campos requeridos
// ============================

class CrearOrdenVentaCamposRequeridosPage {

  // ================= MÉTODOS DE NAVEGACIÓN =================

  clickExportacion() {
    cy.get('#mobile-menu-toggler').click({ force: true });
    cy.contains('div.side-menu__title.arrow', 'Exportación').click({ force: true });
    cy.get('ul.menu__sub-open.ml-4', { timeout: 10000 }).should('be.visible');
  }

  clickCrearOrdenVenta() {
    cy.contains('div.side-menu__title', 'Crear Orden de Venta', { timeout: 10000 })
      .click({ force: true });
  }

  // ================= MÉTODOS DE SELECCIÓN (REQUERIDOS) =================

  selectTagEmpresa() {
    cy.get('select[formcontrolname="IdTag"]', { timeout: 10000 })
      .should('be.visible')
      .select('460', { force: true }); // General
  }

  selectEmpresa() {
    cy.get('select[formcontrolname="IdBusiness"]', { timeout: 10000 })
      .should('be.visible')
      .select('277', { force: true }); // Selaski
  }

  selectIncoterm() {
    cy.get('select[formcontrolname="IdIncoterm"]', { timeout: 10000 })
      .should('be.visible')
      .select('1', { force: true }); // EXW
  }

  // ================= MÉTODO PRINCIPAL - SOLO CAMPOS REQUERIDOS =================

  fillRequiredFields(order) {
    cy.get('form', { timeout: 15000 }).should('be.visible');

    // 1. Nº O.V * (Requerido)
    cy.get('input[formcontrolname="OrderNumber"]')
      .should('be.visible')
      .clear()
      .type(order.number, { force: true });

    // 2. Valor Total O.V. * (Requerido)
    cy.get('input[formcontrolname="TotalValue"]')
      .should('be.visible')
      .clear()
      .type(order.totalValue, { force: true });

    // 3. Empresa * (Requerido)
    this.selectEmpresa();
    cy.wait(500);

    // 4. Incoterm * (Requerido)
    this.selectIncoterm();
    cy.wait(500);

    // 5. Tag empresa * (Requerido)
    this.selectTagEmpresa();
    cy.wait(500);

    // 6. Orden Fraccionada * (Requerido)
    if (order.fractionada) {
      cy.get('#fracionada-si').check({ force: true });
    } else {
      cy.get('#fracionada-no').check({ force: true });
    }

    cy.log(' Campos requeridos de la orden de venta han sido llenados correctamente');
  }

  // ================= MÉTODOS DE GUARDADO =================

  saveOrder() {
    cy.contains('button', 'Guardar', { timeout: 10000 })
      .scrollIntoView({ block: 'center' })
      .click({ force: true });
  }

  assertOrderCreated() {
    cy.contains('Orden Creada', { timeout: 30000 }).should('be.visible');
    cy.contains('Se ha creado la orden', { timeout: 30000 }).should('be.visible');
    cy.log(' Orden de venta creada exitosamente con solo campos requeridos');
  }

  // ================= MÉTODO RÁPIDO - FLUJO COMPLETO =================

  crearOrdenVentaSoloRequeridos(order) {
    this.clickExportacion();
    this.clickCrearOrdenVenta();
    this.fillRequiredFields(order);
    this.saveOrder();
    this.assertOrderCreated();
  }
}

export default CrearOrdenVentaCamposRequeridosPage;