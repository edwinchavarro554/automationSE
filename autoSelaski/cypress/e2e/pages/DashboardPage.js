// ============================================================================
// Archivo: cypress/e2e/pages/DashboardPage.js
// Descripción: Página del Dashboard para navegación principal
// Autor: Equipo QA Automation
// ============================================================================

class DashboardPage {

  // --------------------------------------------------------------------------
  // Selectores del Dashboard
  // --------------------------------------------------------------------------
  selectors = {
    // Menú principal
    menuExportacion: 'a[href*="exportacion"], button:contains("Exportación")',
    menuImportacion: 'a[href*="importacion"], button:contains("Importación")',
    
    // Botones de acción
    botonCrearOrdenCompra: 'button:contains("Crear Orden de Compra")',
    botonGuardar: 'button:contains("Guardar"), button.bg-theme-1',
    botonConfirmar: 'button:contains("Confirmar")',
    
    // Mensajes del sistema
    mensajeExito: '.alert-success, .toast-success, .message-success',
    mensajeError: '.alert-error, .toast-error, .message-error',
    
    // Loaders y estados
    loader: '.spinner, .loading, [data-testid="loader"]'
  };

  // --------------------------------------------------------------------------
  // Métodos de navegación principal
  // --------------------------------------------------------------------------

  // Navegar a la sección de Exportación
  clickExportacion() {
    cy.log('Navegando a la sección de Exportación');
    cy.get(this.selectors.menuExportacion)
      .should('be.visible')
      .click({ force: true });
    cy.wait(1000);
  }

  // Navegar a la sección de Importación
  clickImportacion() {
    cy.log('Navegando a la sección de Importación');
    cy.get(this.selectors.menuImportacion)
      .should('be.visible')
      .click({ force: true });
    cy.wait(1000);
  }

  // Hacer clic en Crear Orden de Compra
  clickCrearOrdenCompra() {
    cy.log('Haciendo clic en Crear Orden de Compra');
    cy.get(this.selectors.botonCrearOrdenCompra)
      .should('be.visible')
      .click({ force: true });
    cy.wait(1500);
  }

  // --------------------------------------------------------------------------
  // Métodos de acciones y validaciones
  // --------------------------------------------------------------------------

  // Guardar la orden
  saveOrder() {
    cy.log('Guardando la orden de compra');
    cy.get(this.selectors.botonGuardar)
      .should('be.visible')
      .click({ force: true });
    
    // Esperar a que se procese el guardado
    cy.wait(3000);
  }

  // Verificar que la orden se creó exitosamente
  assertOrderCreated() {
    cy.log('Verificando que la orden se creó exitosamente');
    cy.get(this.selectors.mensajeExito, { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'éxito');
  }

  // Verificar mensajes de error
  assertErrorVisible() {
    cy.log('Verificando mensajes de error');
    cy.get(this.selectors.mensajeError, { timeout: 5000 })
      .should('be.visible');
  }

  // Esperar a que desaparezca el loader
  waitForLoaderToDisappear() {
    cy.log('Esperando a que desaparezca el loader');
    cy.get(this.selectors.loader, { timeout: 10000 })
      .should('not.exist');
  }
}

export default DashboardPage;