// ============================
// Archivo: eliminarProductoEnOrdenCompraPage.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Page Object para eliminar productos en órdenes de compra
// ============================

class EliminarProductoEnOrdenCompraPage {

  // ================= MÉTODOS DE NAVEGACIÓN =================

  clickImportacion() {
    cy.get('#mobile-menu-toggler').click({ force: true });
    cy.contains('div.side-menu__title.arrow', 'Importación').click({ force: true });
    cy.get('ul.menu__sub-open.ml-4', { timeout: 10000 }).should('be.visible');
  }

  clickOrdenCompra() {
    cy.contains('div.side-menu__title', 'Orden de Compra', { timeout: 10000 })
      .click({ force: true });
  }

  // ================= MÉTODOS PARA CREAR PRODUCTO (PARA PRUEBAS) =================

  clickAgregarProducto() {
    cy.contains('button', 'Agregar Producto', { timeout: 15000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.contains('h2', 'Agregar Producto', { timeout: 10000 })
      .should('be.visible');
  }

  llenarFormularioProducto(producto) {
    // Información básica
    cy.get('input[formcontrolname="Description"]').clear().type(producto.descripcion, { force: true });
    cy.get('input[formcontrolname="SKU"]').clear().type(producto.sku, { force: true });
    cy.get('input[formcontrolname="ProviderCode"]').clear().type(producto.codigoProveedor, { force: true });
    cy.get('input[formcontrolname="Detail"]').clear().type(producto.detalle, { force: true });
    cy.get('input[formcontrolname="BrandName"]').clear().type(producto.nombreComercial, { force: true });
    cy.get('input[formcontrolname="UsageDescription"]').clear().type(producto.uso, { force: true });
    cy.get('input[formcontrolname="Observation"]').clear().type(producto.observacion, { force: true });
    
    // Seleccionar cliente
    this._seleccionarOpcion('ng-select[bindlabel="CompanyName"][bindvalue="CompanyName"]');
    
    // Seleccionar categoría y subcategoría
    this._seleccionarOpcion('ng-select[formcontrolname="IdCategory"]');
    cy.wait(1000);
    this._seleccionarOpcion('ng-select[formcontrolname="IdSubCategory"]');
    cy.wait(500);
    
    // Fechas
    cy.get('input[formcontrolname="DeliveryDate"]').first().clear({ force: true }).type(producto.tProduccionPlanificada, { force: true });
    cy.get('input[formcontrolname="ETDRequest"]').first().clear({ force: true }).type(producto.etdRequested, { force: true });
    cy.get('input[formcontrolname="ETARequest"]').first().clear({ force: true }).type(producto.etaRequested, { force: true });
    cy.get('input[formcontrolname="WarehouseRequest"]').first().clear({ force: true }).type(producto.warehouseRequestDate, { force: true });
    
    // Nivel de criticidad
    this._seleccionarOpcion('ng-select[formcontrolname="IdPriorityLevel"]');
    cy.wait(500);
    
    // Cantidades y unidades
    cy.get('input[formcontrolname="Quantity"]').clear().type(producto.cantidad, { force: true });
    this._seleccionarOpcion('ng-select[bindvalue="IdUnit"]');
    cy.wait(500);
    cy.get('input[formcontrolname="QtyBox"]').clear().type(producto.qtyBox, { force: true });
    cy.get('input[formcontrolname="PackageIdUnit"]').clear().type(producto.paquete, { force: true });
    
    // Pesos y valores
    cy.get('input[formcontrolname="Weight"]').clear().type(producto.pesoNeto, { force: true });
    cy.get('input[formcontrolname="Volumen"]').clear().type(producto.volumenNeto, { force: true });
    cy.get('input[formcontrolname="ValueUnit"]').clear().type(producto.valorUnitario, { force: true });
    cy.get('input[formcontrolname="ValueUnitRequest"]').clear().type(producto.valorUnitSolic, { force: true });
    
    // Información adicional
    cy.get('input[formcontrolname="Mark"]').clear().type(producto.marca, { force: true });
    cy.get('input[formcontrolname="Center"]').clear().type(producto.centro, { force: true });
    cy.get('input[formcontrolname="Warehouse"]').clear().type(producto.almacen, { force: true });
  }

  _seleccionarOpcion(selector) {
    cy.get(selector)
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.wait(1000);
    
    cy.get('body').then(($body) => {
      if ($body.find('ng-dropdown-panel').length > 0) {
        cy.get('ng-dropdown-panel .ng-option')
          .first()
          .should('be.visible')
          .click({ force: true });
      } else {
        cy.get(selector)
          .find('input')
          .first()
          .type('{downarrow}', { force: true })
          .wait(500)
          .type('{enter}', { force: true });
      }
    });
  }

  clickBotonAgregar() {
    cy.get('button.ml-auto.mr-5.button.w-24.bg-theme-1.text-white')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  verificarProductoAgregado() {
    cy.get('.loader, .spinner, [class*="loading"]', { timeout: 15000 })
      .should('not.exist');
    
    cy.get('table.table-report tbody tr', { timeout: 15000 })
      .should('have.length.at.least', 1);
    
    cy.wait(2000);
  }

  cerrarModalProducto() {
    cy.get('body').then(($body) => {
      if ($body.find('svg.feather-x, .modal__close, button[aria-label="Close"]').length > 0) {
        cy.get('svg.feather-x, .modal__close, button[aria-label="Close"]')
          .first()
          .click({ force: true });
      } else if ($body.find('.modal__content').length > 0) {
        cy.get('body').type('{esc}', { force: true });
      } else if ($body.find('.modal, .modal__overlay').length > 0) {
        cy.get('.modal, .modal__overlay')
          .first()
          .click({ force: true });
      }
    });
    
    cy.get('.modal__content, .modal, .modal__overlay', { timeout: 10000 })
      .should('not.exist');
  }

  // ================= MÉTODOS PARA SELECCIONAR PRODUCTO =================

  buscarProductoPorSKU(sku) {
    cy.get('table.table-report tbody tr', { timeout: 15000 })
      .contains('td', sku)
      .should('exist')
      .parents('tr')
      .as('filaProducto');
    
    return cy.get('@filaProducto');
  }

  seleccionarProductoPorSKU(sku) {
    this.buscarProductoPorSKU(sku).within(() => {
      cy.get('input.form-checkbox.rowCheckbox[type="checkbox"]')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
    });
  }

  verificarProductoEnTabla(sku) {
    cy.get('table.table-report tbody tr', { timeout: 10000 })
      .contains('td', sku)
      .should('exist');
  }

  // ================= MÉTODOS PARA ELIMINAR PRODUCTO =================

  clickBotonEliminar() {
    cy.get('button.bg-theme-1.text-white')
      .contains('Eliminar')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  eliminarProductoDesdeDropdown(sku) {
    this.buscarProductoPorSKU(sku).within(() => {
      cy.get('a.dropdown-toggle')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
      
      cy.get('.dropdown-box__content', { timeout: 5000 })
        .should('be.visible');
      
      cy.contains('a', 'Eliminar')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
    });
    
    this.confirmarEliminacionSiAplica();
    this.verificarProductoEliminado(sku);
  }

  // ================= MÉTODOS DE CONFIRMACIÓN =================

  confirmarEliminacionSiAplica() {
    cy.get('body').then(($body) => {
      if ($body.find('.modal-content, .swal2-container, .confirmation-dialog, .swal2-popup').length > 0) {
        cy.wait(1000);
        
        if ($body.find('button:contains("Sí"), button:contains("Yes"), button:contains("Confirmar"), button:contains("Confirm")').length > 0) {
          cy.contains('button', 'Sí', { timeout: 5000 })
            .should('be.visible')
            .click({ force: true });
        } else if ($body.find('button:contains("Aceptar"), button:contains("OK"), button:contains("Aceptar")').length > 0) {
          cy.contains('button', 'Aceptar', { timeout: 5000 })
            .should('be.visible')
            .click({ force: true });
        } else {
          cy.get('.swal2-confirm, .btn-success, .bg-theme-1, .btn-primary, .button--primary', { timeout: 5000 })
            .first()
            .should('be.visible')
            .click({ force: true });
        }
        
        cy.get('.swal2-container, .modal-content', { timeout: 10000 })
          .should('not.exist');
      }
    });
  }

  cancelarEliminacionSiAplica() {
    cy.get('body').then(($body) => {
      if ($body.find('.modal-content, .swal2-container, .confirmation-dialog, .swal2-popup').length > 0) {
        const cancelButtons = $body.find('button:contains("No"), button:contains("Cancelar"), button:contains("Cancel")');
        
        if (cancelButtons.length > 0) {
          cy.wrap(cancelButtons)
            .first()
            .click({ force: true });
        } else {
          cy.get('.swal2-cancel, .btn-secondary, .button--secondary', { timeout: 5000 })
            .first()
            .click({ force: true });
        }
      }
    });
  }

  // ================= VALIDACIONES =================

  verificarProductoEliminado(sku) {
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      if ($body.find('table.table-report tbody tr').length > 0) {
        cy.get('table.table-report tbody tr', { timeout: 10000 })
          .then(($rows) => {
            const skuExists = $rows.toArray().some(row => 
              Cypress.$(row).text().includes(sku)
            );
            
            if (skuExists) {
              throw new Error(`El producto ${sku} no fue eliminado correctamente`);
            }
          });
      }
    });
    
    cy.get('body').then(($body) => {
      if ($body.find('.toast-success, .alert-success, .success-message, .swal2-success').length > 0) {
        cy.get('.toast-success, .alert-success, .success-message, .swal2-success')
          .should('be.visible')
          .and('contain', 'eliminado', 'eliminada', 'success', 'éxito');
      }
    });
  }

  // ================= MÉTODOS PARA ELIMINACIÓN MÚLTIPLE =================

  eliminarMultiplesProductos(skus) {
    skus.forEach(sku => {
      this.seleccionarProductoPorSKU(sku);
    });
    
    this.clickBotonEliminar();
    this.confirmarEliminacionSiAplica();
    
    skus.forEach(sku => {
      this.verificarProductoEliminado(sku);
    });
  }

  // ================= MÉTODO COMPLETO PARA ELIMINAR =================

  eliminarProducto(sku) {
    this.verificarProductoEnTabla(sku);
    this.seleccionarProductoPorSKU(sku);
    this.clickBotonEliminar();
    this.confirmarEliminacionSiAplica();
    this.verificarProductoEliminado(sku);
  }
}

export default EliminarProductoEnOrdenCompraPage;