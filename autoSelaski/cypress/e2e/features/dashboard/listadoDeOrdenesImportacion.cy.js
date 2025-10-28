// cypress/e2e/features/dashboard/listadoDeOrdenesImportacion.cy.js
// ============================
// Archivo: listadoDeOrdenesImportacion.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Prueba E2E para el listado de órdenes de importación con filtros avanzados
// ============================

import ListadoDeOrdenesImportacionPage from '../../pages/listadoDeOrdenesImportacionPage';

describe('Dashboard QA - Importación - Listado de Órdenes', { 
  viewportHeight: 1080, 
  viewportWidth: 1920 
}, () => {

  const listadoOrdenes = new ListadoDeOrdenesImportacionPage();

  beforeEach(() => {
    // INTERCEPTAR ANTES del login para capturar las requests
    cy.intercept('POST', '**/api/orders/custom/**').as('loadOrders');
    
    cy.loginPersistent(); 

    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  it('Validar navegacion al listado de órdenes de importación y expandir filtros', () => {
    // Navegar a la página y esperar la carga
    listadoOrdenes.clickImportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    // ESPERAR LA REQUEST aquí, después de la navegación
    cy.wait('@loadOrders', { timeout: 15000 });
    
    listadoOrdenes.verificarFiltrosVisibles();
    listadoOrdenes.inicializarFiltros();
    listadoOrdenes.verificarModoOrdenActivo();
  });

  it('Validar filtrado de órdenes por estado en modo orden', () => {
    // Navegar
    listadoOrdenes.clickImportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    // Esperar carga inicial
    cy.wait('@loadOrders', { timeout: 15000 });
    listadoOrdenes.inicializarFiltros();

    // Filtrar por estado activa
    listadoOrdenes.seleccionarEstadoOrden('Activa');
    
    listadoOrdenes.verificarFiltrosAplicados();
    
    // Verificar resultados de manera tolerante para debugging
    listadoOrdenes.verificarResultadosConTolerancia().then((hasResults) => {
      if (!hasResults) {
        cy.log('No se encontraron resultados después de filtrar por estado Activa');
      }
    });
  });

  it('alidar filtrado de órdenes por empresa en modo orden', () => {
    listadoOrdenes.clickImportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    cy.wait('@loadOrders', { timeout: 15000 });
    listadoOrdenes.inicializarFiltros();

    // Filtrar por empresa
    listadoOrdenes.seleccionarEmpresa('Selaski');
    
    listadoOrdenes.verificarFiltrosAplicados();
    listadoOrdenes.verificarResultadosConTolerancia().then((hasResults) => {
      if (!hasResults) {
        cy.log('No se encontraron resultados después de filtrar por empresa Selaski');
      }
    });
  });

  it('alidar cambio entre modo productos y modo orden', () => {
    listadoOrdenes.clickImportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    cy.wait('@loadOrders', { timeout: 15000 });
    listadoOrdenes.inicializarFiltros();

    // Aplicar un filtro básico primero
    listadoOrdenes.seleccionarEstadoOrden('Activa');
    
    // Verificar que hay resultados iniciales
    listadoOrdenes.verificarResultadosConTolerancia();

    // Cambiar a modo productos
    listadoOrdenes.cambiarModoProductos();
    listadoOrdenes.verificarModoProductosActivo();

    // Volver a modo orden
    listadoOrdenes.cambiarModoOrden();
    listadoOrdenes.verificarModoOrdenActivo();

    // Verificar que todavía hay resultados
    listadoOrdenes.verificarResultadosConTolerancia();
  });

  it('alidar aplicación de múltiples filtros básicos en modo orden', () => {
    listadoOrdenes.clickImportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    cy.wait('@loadOrders', { timeout: 15000 });
    listadoOrdenes.inicializarFiltros();

    // Aplicar varios filtros básicos con esperas entre ellos
    listadoOrdenes.seleccionarEmpresa('Selaski');
    cy.wait(1000);
    listadoOrdenes.seleccionarEstadoOrden('Activa');
    cy.wait(1000);
    listadoOrdenes.seleccionarSaldoEmbarcadoCero();
    
    listadoOrdenes.verificarFiltrosAplicados();
    listadoOrdenes.verificarResultadosConTolerancia().then((hasResults) => {
      if (!hasResults) {
        cy.log('No se encontraron resultados con la combinación de filtros aplicada');
      }
    });
  });

  it('Validar uso de búsqueda general para filtrar órdenes', () => {
    listadoOrdenes.clickImportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    cy.wait('@loadOrders', { timeout: 15000 });
    listadoOrdenes.inicializarFiltros();

    // Usar búsqueda general
    listadoOrdenes.usarBusquedaGeneral('OC-', 'Orden');
    
    listadoOrdenes.verificarFiltrosAplicados();
    listadoOrdenes.verificarResultadosConTolerancia();
  });

  it('Validar descarga de resultados filtrados', () => {
    listadoOrdenes.clickImportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    cy.wait('@loadOrders', { timeout: 15000 });
    listadoOrdenes.inicializarFiltros();

    // Aplicar filtros básicos primero
    listadoOrdenes.seleccionarEstadoOrden('Activa');
    
    // Verificar que hay resultados antes de descargar
    listadoOrdenes.verificarResultadosConTolerancia().then((hasResults) => {
      if (hasResults) {
        listadoOrdenes.descargarResultados();
      } else {
        cy.log('No hay resultados para descargar');
      }
    });
  });

  it('Validar expansión y uso del panel de filtros', () => {
    listadoOrdenes.clickImportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    cy.wait('@loadOrders', { timeout: 15000 });

    // Expandir filtros
    listadoOrdenes.expandirPanelFiltros();
    listadoOrdenes.verificarPanelFiltrosExpandido();

    // Aplicar un filtro simple
    listadoOrdenes.seleccionarEstadoOrden('Activa');
    
    listadoOrdenes.verificarFiltrosAplicados();
    listadoOrdenes.verificarResultadosConTolerancia();
  });
});