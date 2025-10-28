// ============================
// Archivo: CrearOrdenCompraPage.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Page Object para la creación de órdenes de compra con todos los campos
// ============================

class CrearOrdenCompraPage {

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
      .then(($input) => {
        if (!$input.prop('disabled')) {
          cy.wrap($input).clear();
        }
      })
      .type(partialText, { delay: 100, force: true });

    // Esperar con timeout más flexible
    cy.wait('@getPorts', { timeout: 15000 }).then((interception) => {
      if (interception.response?.body?.length > 0) {
        cy.get('span.cursor-pointer.zoom-in', { timeout: 10000 })
          .first()
          .should('be.visible')
          .click({ force: true });
      } else {
        // Si no hay resultados, limpiar el campo
        cy.get('app-input-search-async input').eq(inputIndex).clear();
        cy.log(`No se encontraron resultados para: ${searchText}`);
      }
    });

    cy.wait(500);
    cy.window().then(win => win.scrollTo(0, 0));
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

  fillAllFields(order) {
    // Campos obligatorios con asterisco
    cy.get('input[formcontrolname="OrderNumber"]')
      .should('be.visible')
      .clear()
      .type(order.number, { force: true });

    cy.get('input[formcontrolname="TotalValue"]')
      .should('be.visible')
      .clear()
      .type(order.totalValue, { force: true });

    this.fillDateField('input[formcontrolname="DateTime"]', order.date);
    this.fillDateField('input[formcontrolname="DateTimeConfirmation"]', order.confirmationDate);
    this.fillDateField('input[formcontrolname="DateTimeReception"]', order.deliveryDate);

    cy.get('select[formcontrolname="IdShippingWay"]')
      .should('be.visible')
      .select('Marítimo', { force: true });

    cy.get('select[formcontrolname="IdBusiness"]')
      .should('be.visible')
      .select(order.company);

    this.selectPuertoOrigen('Cali');

    this.selectFromNgSelect('ng-select[bindlabel="CompanyName"][bindvalue="IdContact"]', 'Productor', 'Productor IMPO', 0);

    this.selectFromNgSelect('ng-select[bindlabel="CompanyName"][bindvalue="IdContact"]', 'STORA', 'STORA ENSO OYJ', 1);

    this.selectCliente(order.cliente || 'Cliente Internacional');

    this.selectUsuario();

    cy.get('select[formcontrolname="IdIncoterm"]')
      .should('be.visible')
      .select(order.incoterm);

    this.fillPaymentForm();

    this.selectTagEmpresa();

    this.selectPuertoDestino('Buenos');

    cy.get('input[formcontrolname="NumPedido"]')
      .should('be.visible')
      .clear()
      .type(order.orderClientNumber || `PED-${Math.floor(Math.random() * 1000)}`, { force: true });

    cy.get('input[formcontrolname="OrderDetails"]')
      .should('be.visible')
      .clear()
      .type(order.orderDescription || 'Descripción completa del pedido para testing automatizado', { force: true });

    this.selectClienteInterno();

    this.fillDateField('input[formcontrolname="PlannedProductionTime"]', order.tProduccionPlanificada);
    this.fillDateField('input[formcontrolname="EffectiveDeliveryDate"]', order.deliveryDate);
    this.fillDateField('input[formcontrolname="ETDRequested"]', order.etdRequested);
    this.fillDateField('input[formcontrolname="ETARequested"]', order.etaRequested);
    this.fillDateField('input[formcontrolname="WarehouseRequestDate"]', order.warehouseRequestDate);

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
    cy.contains('Orden Creada', { timeout: 30000 }).should('be.visible');
    cy.contains('Se ha creado la orden', { timeout: 30000 }).should('be.visible');
  }
}

export default CrearOrdenCompraPage;