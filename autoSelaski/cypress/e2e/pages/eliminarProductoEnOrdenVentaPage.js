// ============================
// Archivo: eliminarProductoEnOrdenVentaPage.js 
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Page Object para eliminar productos en órdenes de venta

// ============================

class EliminarProductoEnOrdenVentaPage {

  // ================= MÉTODOS DE NAVEGACIÓN =================

  clickExportacion() {
    cy.log('Navegando a Exportación...');
    cy.get('#mobile-menu-toggler').click({ force: true });
    cy.contains('div.side-menu__title.arrow', 'Exportación').click({ force: true });
    cy.get('ul.menu__sub-open.ml-4', { timeout: 10000 }).should('be.visible');
    cy.log('Sección Exportación cargada');
  }

  clickOrdenVenta() {
    cy.log('Navegando a Orden de Venta...');
    cy.contains('div.side-menu__title', 'Orden de Venta', { timeout: 10000 })
      .click({ force: true });
    cy.log('Página Orden de Venta cargada');
  }

  // ================= MÉTODOS PARA CREAR PRODUCTO (PARA PRUEBAS) =================

  clickAgregarProducto() {
    cy.log('Haciendo clic en Agregar Producto...');
    
    cy.contains('button', 'Agregar Producto', { timeout: 15000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.log('Modal de Agregar Producto abierto');
    
    // Verificar que el modal se abrió
    cy.contains('h2', 'Agregar Producto', { timeout: 10000 })
      .should('be.visible');
  }

  llenarFormularioProducto(producto) {
    cy.log('Llenando formulario de producto...');
    
    // Información básica
    cy.get('input[formcontrolname="Description"]').clear().type(producto.descripcion, { force: true });
    cy.get('input[formcontrolname="SKU"]').clear().type(producto.sku, { force: true });
    cy.get('input[formcontrolname="Detail"]').clear().type(producto.detalle, { force: true });
    cy.get('input[formcontrolname="BrandName"]').clear().type(producto.nombreComercial, { force: true });
    cy.get('input[formcontrolname="UsageDescription"]').clear().type(producto.uso, { force: true });
    cy.get('input[formcontrolname="Observation"]').clear().type(producto.observacion, { force: true });
    
    // Seleccionar categoría y subcategoría (primeras opciones)
    cy.get('ng-select[formcontrolname="IdCategory"]').click({ force: true });
    cy.wait(1000);
    cy.get('body').type('{downarrow}{enter}', { force: true });
    cy.wait(1000);
    
    cy.get('ng-select[formcontrolname="IdSubCategory"]').click({ force: true });
    cy.wait(1000);
    cy.get('body').type('{downarrow}{enter}', { force: true });
    cy.wait(500);
    
    // Fechas
    cy.get('input[formcontrolname="DeliveryDate"]').first().clear({ force: true }).type(producto.tProduccionPlanificada, { force: true });
    cy.get('input[formcontrolname="ETDRequest"]').first().clear({ force: true }).type(producto.etdRequested, { force: true });
    cy.get('input[formcontrolname="ETARequest"]').first().clear({ force: true }).type(producto.etaRequested, { force: true });
    cy.get('input[formcontrolname="WarehouseRequest"]').first().clear({ force: true }).type(producto.warehouseRequestDate, { force: true });
    
    // Nivel de criticidad
    cy.get('ng-select[formcontrolname="IdPriorityLevel"]').click({ force: true });
    cy.wait(1000);
    cy.get('body').type('{downarrow}{enter}', { force: true });
    cy.wait(500);
    
    // Cantidades y unidades
    cy.get('input[formcontrolname="Quantity"]').clear().type(producto.cantidad, { force: true });
    cy.get('ng-select[bindvalue="IdUnit"]').click({ force: true });
    cy.wait(1500);
    cy.get('body').type('{downarrow}{enter}', { force: true });
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
    
    cy.log('Formulario de producto llenado completamente');
  }

  clickBotonAgregar() {
    cy.log('Haciendo clic en botón Agregar...');
    
    cy.get('button.ml-auto.mr-5.button.w-24.bg-theme-1.text-white')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.log('Clic en Agregar realizado');
  }

  verificarProductoAgregado() {
    cy.log('Validando que el producto fue agregado...');
    
    // Esperar a que desaparezca cualquier indicador de carga
    cy.get('.loader, .spinner, [class*="loading"]', { timeout: 15000 })
      .should('not.exist');
    
    // Verificar que hay al menos una fila en la tabla
    cy.get('table.table-report tbody tr', { timeout: 15000 })
      .should('have.length.at.least', 1);
    
    cy.wait(2000);
    
    cy.log('Producto agregado exitosamente');
  }

  cerrarModalProducto() {
    cy.log('Cerrando modal de producto...');
    
    // Método 1: Botón X
    cy.get('body').then(($body) => {
      if ($body.find('svg.feather-x, .modal__close, button[aria-label="Close"]').length > 0) {
        cy.get('svg.feather-x, .modal__close, button[aria-label="Close"]')
          .first()
          .click({ force: true });
        cy.log('Modal cerrado con botón X');
      }
      // Método 2: Escape key
      else if ($body.find('.modal__content').length > 0) {
        cy.get('body').type('{esc}', { force: true });
        cy.log('Modal cerrado con tecla Escape');
      }
      // Método 3: Clic fuera
      else if ($body.find('.modal, .modal__overlay').length > 0) {
        cy.get('.modal, .modal__overlay')
          .first()
          .click({ force: true });
        cy.log('Modal cerrado con clic fuera');
      }
    });
    
    // Verificar que el modal se cerró
    cy.get('.modal__content, .modal, .modal__overlay', { timeout: 10000 })
      .should('not.exist');
    
    cy.log('Modal cerrado exitosamente');
  }

  // ================= MÉTODOS PARA SELECCIONAR PRODUCTO =================

  buscarProductoPorSKU(sku) {
    cy.log(`Buscando producto con SKU: ${sku}`);
    
    // Buscar en la tabla el producto por SKU
    cy.get('table.table-report tbody tr', { timeout: 15000 })
      .contains('td', sku)
      .should('exist')
      .parents('tr')
      .as('filaProducto');
    
    return cy.get('@filaProducto');
  }

  seleccionarProductoPorSKU(sku) {
    cy.log(`Seleccionando checkbox del producto: ${sku}`);
    
    this.buscarProductoPorSKU(sku).within(() => {
      // Seleccionar el checkbox específico de la fila
      cy.get('input.form-checkbox.rowCheckbox[type="checkbox"]')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
    });
    
    cy.log(`Checkbox del producto ${sku} seleccionado`);
  }

  verificarProductoEnTabla(sku) {
    cy.log(`Verificando que el producto ${sku} está en la tabla`);
    
    cy.get('table.table-report tbody tr', { timeout: 10000 })
      .contains('td', sku)
      .should('exist');
    
    cy.log(`Producto ${sku} encontrado en la tabla`);
  }

  // ================= MÉTODOS PARA ELIMINAR PRODUCTO =================

  clickBotonEliminar() {
    cy.log('Haciendo clic en botón Eliminar principal');
    
    // Buscar y hacer clic en el botón Eliminar principal
    cy.get('button.bg-theme-1.text-white')
      .contains('Eliminar')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.log('Clic en botón Eliminar realizado');
  }

  // Método alternativo: eliminar desde el dropdown de opciones
  eliminarProductoDesdeDropdown(sku) {
    cy.log(`Eliminando producto ${sku} desde dropdown`);
    
    this.buscarProductoPorSKU(sku).within(() => {
      // Hacer clic en el dropdown de opciones (los tres puntos verticales)
      cy.get('a.dropdown-toggle')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
      
      // Esperar a que aparezca el dropdown
      cy.get('.dropdown-box__content', { timeout: 5000 })
        .should('be.visible');
      
      // Hacer clic en la opción Eliminar del dropdown
      cy.contains('a', 'Eliminar')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
    });
    
    // Confirmar eliminación si es necesario
    this.confirmarEliminacionSiAplica();
    
    // Verificar que el producto fue eliminado
    this.verificarProductoEliminado(sku);
    
    cy.log(`Eliminación desde dropdown realizada para producto: ${sku}`);
  }

  // ================= MÉTODOS DE CONFIRMACIÓN =================

  confirmarEliminacionSiAplica() {
    cy.log('Verificando si hay modal de confirmación');
    
    cy.get('body').then(($body) => {
      // Verificar si aparece algún modal de confirmación
      if ($body.find('.modal-content, .swal2-container, .confirmation-dialog, .swal2-popup').length > 0) {
        cy.log('Modal de confirmación detectado, confirmando eliminación');
        
        // Esperar a que el modal esté completamente cargado
        cy.wait(1000);
        
        // Buscar y hacer clic en el botón de confirmación
        if ($body.find('button:contains("Sí"), button:contains("Yes"), button:contains("Confirmar"), button:contains("Confirm")').length > 0) {
          cy.contains('button', 'Sí', { timeout: 5000 })
            .should('be.visible')
            .click({ force: true });
        } else if ($body.find('button:contains("Aceptar"), button:contains("OK"), button:contains("Aceptar")').length > 0) {
          cy.contains('button', 'Aceptar', { timeout: 5000 })
            .should('be.visible')
            .click({ force: true });
        } else {
          // Si no encuentra botones específicos, buscar cualquier botón de acción positiva
          cy.get('.swal2-confirm, .btn-success, .bg-theme-1, .btn-primary, .button--primary', { timeout: 5000 })
            .first()
            .should('be.visible')
            .click({ force: true });
        }
        
        // Esperar a que el modal desaparezca
        cy.get('.swal2-container, .modal-content', { timeout: 10000 })
          .should('not.exist');
        
        cy.log('Eliminación confirmada');
      } else {
        cy.log('No se detectó modal de confirmación, continuando...');
      }
    });
  }

  cancelarEliminacionSiAplica() {
    cy.log('Cancelando eliminación si hay modal');
    
    cy.get('body').then(($body) => {
      if ($body.find('.modal-content, .swal2-container, .confirmation-dialog, .swal2-popup').length > 0) {
        cy.log('Modal detectado, cancelando eliminación');
        
        // Buscar botones de cancelación con diferentes textos
        const cancelButtons = $body.find('button:contains("No"), button:contains("Cancelar"), button:contains("Cancel")');
        
        if (cancelButtons.length > 0) {
          cy.wrap(cancelButtons)
            .first()
            .click({ force: true });
        } else {
          // Si no encuentra botones específicos, buscar botón de cancelación por clase
          cy.get('.swal2-cancel, .btn-secondary, .button--secondary', { timeout: 5000 })
            .first()
            .click({ force: true });
        }
        
        cy.log('Eliminación cancelada');
      } else {
        cy.log('No se detectó modal, no hay nada que cancelar');
      }
    });
  }

  // ================= VALIDACIONES CORREGIDAS =================

  verificarProductoEliminado(sku) {
    cy.log(`Validando que el producto ${sku} fue eliminado`);
    
    // Esperar a que se complete cualquier operación pendiente
    cy.wait(2000);
    
    // VERIFICACIÓN CORREGIDA: Manejar tanto tabla vacía como tabla con productos
    cy.get('body').then(($body) => {
      // Verificar si la tabla existe y tiene filas
      if ($body.find('table.table-report tbody tr').length > 0) {
        // Si hay filas, verificar que el SKU específico no existe
        cy.get('table.table-report tbody tr', { timeout: 10000 })
          .then(($rows) => {
            // Convertir las filas a texto y verificar que ninguna contiene el SKU
            const skuExists = $rows.toArray().some(row => 
              Cypress.$(row).text().includes(sku)
            );
            
            if (skuExists) {
              cy.log(`❌ El producto ${sku} todavía existe en la tabla`);
              throw new Error(`El producto ${sku} no fue eliminado correctamente`);
            } else {
              cy.log(`✅ Producto ${sku} eliminado exitosamente`);
            }
          });
      } else {
        // Si no hay filas, la tabla está vacía - esto también significa que el producto fue eliminado
        cy.log('✅ Tabla vacía - todos los productos fueron eliminados');
      }
    });
    
    // Verificar mensaje de éxito si existe
    cy.get('body').then(($body) => {
      if ($body.find('.toast-success, .alert-success, .success-message, .swal2-success').length > 0) {
        cy.get('.toast-success, .alert-success, .success-message, .swal2-success')
          .should('be.visible')
          .and('contain', 'eliminado', 'eliminada', 'success', 'éxito');
      }
    });
    
    cy.log(`Validación completada para producto: ${sku}`);
  }

  // ================= MÉTODOS PARA ELIMINACIÓN MÚLTIPLE =================

  eliminarMultiplesProductos(skus) {
    cy.log(`Iniciando eliminación múltiple para ${skus.length} productos`);
    
    // Seleccionar todos los productos
    skus.forEach(sku => {
      this.seleccionarProductoPorSKU(sku);
    });
    
    cy.log(`Todos los productos seleccionados: ${skus.join(', ')}`);
    
    // Hacer clic en el botón Eliminar principal
    this.clickBotonEliminar();
    
    // Confirmar la eliminación si es necesario
    this.confirmarEliminacionSiAplica();
    
    // Verificar que todos los productos fueron eliminados
    skus.forEach(sku => {
      this.verificarProductoEliminado(sku);
    });
    
    cy.log(`Eliminación múltiple completada para ${skus.length} productos`);
  }

  // ================= MÉTODO COMPLETO PARA ELIMINAR =================

  eliminarProducto(sku) {
    cy.log(`Iniciando proceso de eliminación para producto: ${sku}`);
    
    // Verificar que el producto existe antes de eliminar
    this.verificarProductoEnTabla(sku);
    
    // Seleccionar el checkbox del producto
    this.seleccionarProductoPorSKU(sku);
    
    // Hacer clic en el botón Eliminar principal
    this.clickBotonEliminar();
    
    // Confirmar la eliminación si es necesario
    this.confirmarEliminacionSiAplica();
    
    // Verificar que el producto fue eliminado
    this.verificarProductoEliminado(sku);
    
    cy.log(`Proceso de eliminación completado para producto: ${sku}`);
  }

  // ================= MÉTODOS ADICIONALES MEJORADOS =================

  forzarCierreModal() {
    cy.log('Forzando cierre de modal...');
    
    cy.get('body').then(($body) => {
      if ($body.find('.modal, .modal__content, [class*="modal"], .swal2-container').length > 0) {
        // Método 1: Escape key
        cy.get('body').type('{esc}', { force: true });
        cy.wait(1000);
        
        // Método 2: Clic en overlay
        cy.get('.modal__overlay, .modal-backdrop, [class*="overlay"], .swal2-container')
          .click({ force: true, multiple: true });
          
        // Método 3: Buscar botón X o Cancelar
        if ($body.find('svg.feather-x, .btn-close, .close, [aria-label="Close"]').length > 0) {
          cy.get('svg.feather-x, .btn-close, .close, [aria-label="Close"]')
            .first()
            .click({ force: true });
        }
        
        // Método 4: Botón Cancelar en SweetAlert
        if ($body.find('.swal2-cancel').length > 0) {
          cy.get('.swal2-cancel').click({ force: true });
        }
      }
    });
    
    // Verificar que no hay modales
    cy.get('.modal, .modal__content, [class*="modal"], .swal2-container', { timeout: 5000 })
      .should('not.exist');
  }

  // ================= MÉTODO PARA VERIFICAR TABLA VACÍA =================
  
  verificarTablaVacia() {
    cy.log('Verificando si la tabla está vacía');
    
    cy.get('body').then(($body) => {
      const $table = $body.find('table.table-report');
      
      if ($table.length > 0) {
        // Verificar si hay filas en el tbody
        const $rows = $table.find('tbody tr');
        
        if ($rows.length === 0) {
          cy.log('✅ La tabla está vacía (sin productos)');
          return true;
        } else {
          cy.log(`ℹ️ La tabla tiene ${$rows.length} productos`);
          return false;
        }
      } else {
        cy.log('⚠️ No se encontró la tabla en la página');
        return false;
      }
    });
  }
}

export default EliminarProductoEnOrdenVentaPage;