// ============================
// Archivo: crearOrdenCompraNoFraccionada.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Page Object ESPECÍFICO para creación de órdenes de compra EXCLUSIVAMENTE NO Fraccionadas
// ============================

class CrearOrdenCompraNoFraccionadaPage {

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

  selectFromNgSelect(selector, searchText, optionText, index = 0) {
    cy.get(selector).eq(index).click({ force: true });
    cy.get(selector).eq(index).find('input').first().clear().type(searchText, { force: true });
    
    cy.get('ng-dropdown-panel', { timeout: 10000 }).should('be.visible');
    
    cy.contains('span.ng-option-label', optionText, { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  selectCliente(clienteName) {
    cy.contains('label', 'Cliente')
      .parent()
      .find('ng-select')
      .click({ force: true });
    
    cy.contains('label', 'Cliente')
      .parent()
      .find('ng-select input')
      .first()
      .clear()
      .type(clienteName, { force: true });
    
    cy.get('ng-dropdown-panel', { timeout: 10000 }).should('be.visible');
    
    cy.contains('span.ng-option-label', clienteName, { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  selectUsuario() {
    cy.contains('label', 'Usuario', { timeout: 10000 })
      .should('be.visible')
      .then(($label) => {
        cy.wrap($label)
          .parent()
          .find('ng-select')
          .should('be.visible')
          .then(($ngSelect) => {
            cy.wrap($ngSelect).click({ force: true });
            cy.wait(800);
            
            cy.get('body').then(($body) => {
              if ($body.find('span.ng-option-label').length > 0) {
                cy.get('span.ng-option-label')
                  .first()
                  .click({ force: true });
              } else {
                cy.wrap($ngSelect)
                  .find('input')
                  .first()
                  .type('{downarrow}', { force: true })
                  .wait(500)
                  .type('{enter}', { force: true });
              }
            });
          });
      });
  }

  selectClienteInterno() {
    cy.contains('label', 'Cliente Interno', { timeout: 10000 })
      .should('be.visible')
      .then(($label) => {
        cy.wrap($label)
          .parent()
          .find('ng-select')
          .should('be.visible')
          .then(($ngSelect) => {
            cy.wrap($ngSelect).click({ force: true });
            cy.wait(1000);
            
            cy.wrap($ngSelect)
              .find('input')
              .first()
              .should('be.visible')
              .clear()
              .type('Nombre', { force: true });
            
            cy.wait(800);
            
            cy.contains('span.ng-option-label', 'Nombre Prueba', { timeout: 10000 })
              .scrollIntoView()
              .should('be.visible')
              .click({ force: true });
          });
      });
  }

  fillDateField(selector, date) {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector, { timeout: 10000 })
          .scrollIntoView({ block: 'center' })
          .should('be.visible')
          .clear()
          .type(date, { force: true })
          .type('{esc}')
          .blur();
        
        cy.wait(200);
      }
    });
  }

  selectPort(inputIndex = 0, searchText) {
    cy.intercept('GET', '**/api/selects/countrys/portscity/**').as('getPorts');

    const partialText = searchText.substring(0, 3);

    cy.get('app-input-search-async input').eq(inputIndex)
      .should('be.visible')
      .clear()
      .type(partialText, { delay: 50, force: true });

    cy.wait('@getPorts');

    cy.get('span.cursor-pointer.zoom-in', { timeout: 20000 })
      .first()
      .should('be.visible')
      .click({ force: true });

    cy.wait(300);
    cy.window().then(win => win.scrollTo(0, 0));
    cy.wait(200);
  }

  selectPuertoOrigen(searchText = 'Cal') {
    this.selectPort(0, searchText);
  }

  selectPuertoDestino(searchText = 'Bue') {
    this.selectPort(1, searchText);
  }

  fillPaymentForm() {
    cy.contains('div', 'Forma de Pago')
      .parent()
      .find('div.border.rounded.pl-1')
      .click({ force: true });

    cy.contains('h2', 'Detalles de Pago', { timeout: 10000 })
      .should('be.visible');

    cy.get('select[style*="font-size: 11px"]')
      .select('Anticipado OC', { force: true });

    cy.get('span.cursor-pointer.bg-theme-1')
      .click({ force: true });

    cy.contains('label', 'Anticipado OC', { timeout: 5000 })
      .should('be.visible');

    cy.get('div.container_modal')
      .contains('button', 'Guardar')
      .click({ force: true });

    cy.contains('h2', 'Detalles de Pago')
      .should('not.exist');
  }

  // MÉTODO ESPECÍFICO para NO Fraccionada - NO usa condicionales
  fillAllFieldsNoFraccionada(order) {
    cy.get('form', { timeout: 15000 }).should('be.visible');

    // 1. Nº O.C *
    cy.get('input[formcontrolname="OrderNumber"]')
      .should('be.visible')
      .clear()
      .type(order.number, { force: true });

    // 2. Valor Total O.C. *
    cy.get('input[formcontrolname="TotalValue"]')
      .should('be.visible')
      .clear()
      .type(order.totalValue, { force: true });

    // 3. Fecha O.C
    this.fillDateField('input[formcontrolname="DateTime"]', order.date);
    
    // 4. Fecha Confirmación
    this.fillDateField('input[formcontrolname="DateTimeConfirmation"]', order.confirmationDate);
    
    // 5. Fecha Recepción
    this.fillDateField('input[formcontrolname="DateTimeReception"]', order.deliveryDate);

    // 6. Forma de Envío
    cy.get('select[formcontrolname="IdShippingWay"]')
      .should('be.visible')
      .select('Marítimo', { force: true });

    // 7. Empresa *
    cy.get('select[formcontrolname="IdBusiness"]')
      .should('be.visible')
      .select(order.company);

    // 8. Puerto Origen
    this.selectPuertoOrigen('Cali');

    // 9. Productor
    this.selectFromNgSelect('ng-select[bindlabel="CompanyName"][bindvalue="IdContact"]', 'Productor', 'Productor IMPO', 0);

    // 10. Proveedor
    this.selectFromNgSelect('ng-select[bindlabel="CompanyName"][bindvalue="IdContact"]', 'STORA', 'STORA ENSO OYJ', 1);

    // 11. Cliente
    this.selectCliente(order.cliente || 'Cliente Internacional');

    // 12. Usuario
    this.selectUsuario();

    // 13. Incoterm *
    cy.get('select[formcontrolname="IdIncoterm"]')
      .should('be.visible')
      .select(order.incoterm);

    // 14. Forma de Pago
    this.fillPaymentForm();

    // 15. Tag empresa *
    this.selectTagEmpresa();

    // 16. Puerto Destino
    this.selectPuertoDestino('Buenos');

    // 17. O.C Cliente
    cy.get('input[formcontrolname="NumPedido"]')
      .should('be.visible')
      .clear()
      .type(order.orderClientNumber || `PED-${Math.floor(Math.random() * 1000)}`, { force: true });

    // 18. Detalle Pedido
    cy.get('input[formcontrolname="OrderDetails"]')
      .should('be.visible')
      .clear()
      .type(order.orderDescription || 'Descripción completa del pedido NO fraccionado para testing automatizado', { force: true });

    // 19. Cliente Interno
    this.selectClienteInterno();

    // 20. T. Producción Planificada
    this.fillDateField('input[formcontrolname="PlannedProductionTime"]', order.tProduccionPlanificada);
    
    // 21. Fecha Entrega
    this.fillDateField('input[formcontrolname="EffectiveDeliveryDate"]', order.deliveryDate);
    
    // 22. Solicitud ETD
    this.fillDateField('input[formcontrolname="ETDRequested"]', order.etdRequested);
    
    // 23. Solicitud ETA
    this.fillDateField('input[formcontrolname="ETARequested"]', order.etaRequested);
    
    // 24. Solicitud Bodega
    this.fillDateField('input[formcontrolname="WarehouseRequestDate"]', order.warehouseRequestDate);

    // 25. Orden Fraccionada * - EXCLUSIVAMENTE NO FRACCIONADA
    cy.get('#fracionada-no').check({ force: true });

    cy.log('Todos los campos de la orden de compra EXCLUSIVAMENTE NO fraccionada han sido llenados correctamente');
  }

  // Método de verificación ESPECÍFICO para NO Fraccionada
  verifyNoFraccionadaSelected() {
    cy.get('#fracionada-no').should('be.checked');
    cy.get('#fracionada-si').should('not.be.checked');
    cy.log('Verificación EXITOSA: Orden configurada EXCLUSIVAMENTE como NO Fraccionada');
  }

  saveOrder() {
    cy.contains('button', 'Guardar', { timeout: 10000 })
      .scrollIntoView({ block: 'center' })
      .click({ force: true });
  }

  assertOrderCreated() {
    cy.contains('Orden Creada', { timeout: 30000 }).should('be.visible');
    cy.contains('Se ha creado la orden', { timeout: 30000 }).should('be.visible');
    cy.log('Orden de compra EXCLUSIVAMENTE NO fraccionada creada exitosamente');
  }

  // Método rápido ESPECÍFICO para flujo completo NO fraccionado
  crearOrdenCompraExclusivamenteNoFraccionada(order) {
    this.clickImportacion();
    this.clickCrearOrdenCompra();
    this.fillAllFieldsNoFraccionada(order);
    this.verifyNoFraccionadaSelected();
    this.saveOrder();
    this.assertOrderCreated();
  }
}

export default CrearOrdenCompraNoFraccionadaPage;