// ============================
// Archivo: crearOrdenVentaPage.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Page Object para la creación de órdenes de venta con todos los campos
// ============================

class CrearOrdenVentaPage {

  clickExportacion() {
    cy.get('#mobile-menu-toggler').click({ force: true });
    cy.contains('div.side-menu__title.arrow', 'Exportación').click({ force: true });
    cy.get('ul.menu__sub-open.ml-4', { timeout: 10000 }).should('be.visible');
  }

  clickCrearOrdenVenta() {
    cy.contains('div.side-menu__title', 'Crear Orden de Venta', { timeout: 10000 })
      .click({ force: true });
  }

  // ================= MÉTODOS DE SELECCIÓN =================

  selectTagEmpresa() {
    cy.get('select[formcontrolname="IdTag"]', { timeout: 10000 })
      .should('be.visible')
      .then(($select) => {
        // Seleccionar "General" que tiene value="460"
        cy.wrap($select).select('460', { force: true });
      });
  }

  selectEmpresa() {
    cy.get('select[formcontrolname="IdBusiness"]', { timeout: 10000 })
      .should('be.visible')
      .then(($select) => {
        cy.wrap($select).select('277', { force: true }); // Selaski
      });
  }

  selectIncoterm() {
    cy.get('select[formcontrolname="IdIncoterm"]', { timeout: 10000 })
      .should('be.visible')
      .then(($select) => {
        cy.wrap($select).select('1', { force: true }); // EXW
      });
  }

  selectFormaEnvio() {
    cy.get('select[formcontrolname="IdShippingWay"]', { timeout: 10000 })
      .should('be.visible')
      .then(($select) => {
        cy.wrap($select).select('3', { force: true }); // Marítimo
      });
  }

  // ================= MÉTODOS DE NG-SELECT =================

  selectFromNgSelect(selector, searchText, optionText, index = 0) {
    cy.get(selector).eq(index).click({ force: true });
    cy.get(selector).eq(index).find('input').first().clear().type(searchText, { force: true });
    
    cy.get('ng-dropdown-panel', { timeout: 10000 }).should('be.visible');
    
    cy.contains('span.ng-option-label', optionText, { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  selectComprador() {
    cy.contains('label', 'Comprador')
      .parent()
      .find('ng-select')
      .click({ force: true });
    
    cy.contains('label', 'Comprador')
      .parent()
      .find('ng-select input')
      .first()
      .clear()
      .type('Comprador', { force: true });
    
    cy.get('ng-dropdown-panel', { timeout: 10000 }).should('be.visible');
    
    cy.contains('span.ng-option-label', 'Comprador prueba', { timeout: 10000 })
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
            cy.wait(1500);
            
            // MÉTODO ROBUSTO: Verificar si hay opciones y seleccionar la primera disponible
            cy.get('body').then(($body) => {
              if ($body.find('span.ng-option-label').length > 0) {
                // Seleccionar la PRIMERA opción disponible
                cy.get('span.ng-option-label')
                  .first()
                  .scrollIntoView()
                  .should('be.visible')
                  .click({ force: true });
              } else {
                // Fallback con teclado
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

  // ================= MÉTODOS DE FECHA =================

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

  // ================= MÉTODOS DE PUERTOS =================

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

  // ================= FORMA DE PAGO - VERSIÓN SIMPLIFICADA =================

  fillPaymentForm() {
    // 1. Hacer clic para abrir el modal de Forma de Pago
    cy.contains('div', 'Forma de Pago')
      .parent()
      .find('div.border.rounded.pl-1')
      .click({ force: true });

    // 2. Esperar a que el modal esté visible
    cy.contains('h2', 'Detalles de Pago', { timeout: 10000 })
      .should('be.visible');

    // 3. Seleccionar "Anticipado OC" en el dropdown
    cy.get('select[style*="font-size: 11px"]')
      .select('Anticipado OC', { force: true });

    // 4. Hacer clic en el botón de agregar (icono +)
    cy.get('span.cursor-pointer.bg-theme-1')
      .click({ force: true });

    // 5. Esperar un momento
    cy.wait(2000);

    // 6. Hacer clic en el botón "Guardar" del modal
    cy.get('div.container_modal')
      .contains('button', 'Guardar')
      .click({ force: true });

    // 7. Verificar que el modal se cierre
    cy.contains('h2', 'Detalles de Pago')
      .should('not.exist');
  }

  // ================= MÉTODO PRINCIPAL - FLUJO COMPLETO CORREGIDO =================

  fillAllFields(order) {
    cy.get('form', { timeout: 15000 }).should('be.visible');

    // 1. Nº O.V *
    cy.get('input[formcontrolname="OrderNumber"]')
      .should('be.visible')
      .clear()
      .type(order.number, { force: true });

    // 2. Valor Total O.V. *
    cy.get('input[formcontrolname="TotalValue"]')
      .should('be.visible')
      .clear()
      .type(order.totalValue, { force: true });

    // 3. Fecha O.V
    this.fillDateField('input[formcontrolname="DateTime"]', order.date);
    
    // 4. Fecha Confirmación
    this.fillDateField('input[formcontrolname="DateTimeConfirmation"]', order.confirmationDate);
    
    // 5. Fecha Recepción
    this.fillDateField('input[formcontrolname="DateTimeReception"]', order.deliveryDate);

    // 6. O.C Cliente
    cy.get('input[formcontrolname="ClientOrder"]')
      .should('be.visible')
      .clear()
      .type(order.orderClientNumber, { force: true });

    // 7. Forma de Envío
    this.selectFormaEnvio();
    cy.wait(500);

    // 8. Empresa *
    this.selectEmpresa();
    cy.wait(500);

    // 9. Puerto Origen
    this.selectPuertoOrigen('Cali');
    cy.wait(500);

    // 10. Productor
    this.selectFromNgSelect('ng-select[bindlabel="CompanyName"][bindvalue="IdContact"]', 'Productor', 'Productor IMPO', 0);
    cy.wait(500);

    // 11. Comprador
    this.selectComprador();
    cy.wait(500);

    // 12. Incoterm *
    this.selectIncoterm();
    cy.wait(500);

    // 13. Forma de Pago - VERSIÓN SIMPLIFICADA
    this.fillPaymentForm();
    cy.wait(500);

    // 14. Usuario
    this.selectUsuario();
    cy.wait(500);

    // 15. Tag empresa * - CORREGIDO: Selecciona "General" específicamente
    this.selectTagEmpresa();
    cy.wait(500);

    // 16. Puerto Destino
    this.selectPuertoDestino('Buenos');
    cy.wait(500);

    // 17. N° Contrato
    cy.get('input[formcontrolname="ContractNumber"]')
      .should('be.visible')
      .clear()
      .type(order.contractNumber, { force: true });

    // 18. Detalle Pedido
    cy.get('input[formcontrolname="OrderDetails"]')
      .should('be.visible')
      .clear()
      .type(order.orderDescription, { force: true });

    cy.log(' Campo "Descripción del Pedido" no existe en el formulario, omitiendo...');

    // 20. Cliente Interno - Selecciona la PRIMERA opción disponible
    this.selectClienteInterno();
    cy.wait(500);

    // 21. T. Producción Planificada
    this.fillDateField('input[formcontrolname="PlannedProductionTime"]', order.tProduccionPlanificada);
    
    // 22. Fecha Entrega
    this.fillDateField('input[formcontrolname="EffectiveDeliveryDate"]', order.deliveryDate);
    
    // 23. Solicitud ETD
    this.fillDateField('input[formcontrolname="ETDRequested"]', order.etdRequested);
    
    // 24. Solicitud ETA
    this.fillDateField('input[formcontrolname="ETARequested"]', order.etaRequested);
    
    // 25. Solicitud Bodega
    this.fillDateField('input[formcontrolname="WarehouseRequestDate"]', order.warehouseRequestDate);

    // 26. Orden Fraccionada *
    if (order.fractionada) {
      cy.get('#fracionada-si').check({ force: true });
    } else {
      cy.get('#fracionada-no').check({ force: true });
    }

    cy.log(' Todos los campos de la orden de venta han sido llenados correctamente');
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
    cy.log(' Orden de venta creada exitosamente');
  }
}

export default CrearOrdenVentaPage;