// ============================
// Archivo: listadoDeOrdenesExportacion.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Prueba E2E para filtrado y navegación en listado de órdenes de exportación
// ============================

import ListadoDeOrdenesExportacionPage from '../../pages/listadoDeOrdenesExportacionPage';

describe('Dashboard QA - Exportación - Listado de Órdenes', { 
  viewportHeight: 1080, 
  viewportWidth: 1920 
}, () => {

  const listadoOrdenes = new ListadoDeOrdenesExportacionPage();

  beforeEach(() => {
    // Interceptar requests de órdenes de exportación
    cy.intercept('POST', '**/api/orders/custom/**').as('loadOrders');
    
    cy.loginPersistent(); 

    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  it('Validar navegación al listado de órdenes de exportación y expansión de filtros', () => {
    // Navegar a la página
    listadoOrdenes.clickExportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    // Esperar la carga de datos
    cy.wait('@loadOrders', { timeout: 15000 });
    
    listadoOrdenes.verificarFiltrosVisibles();
    listadoOrdenes.inicializarFiltros();
    listadoOrdenes.verificarModoOrdenActivo();
  });

  it('Validar filtrado de órdenes por estado en modo orden', () => {
    listadoOrdenes.clickExportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    cy.wait('@loadOrders', { timeout: 15000 });
    listadoOrdenes.inicializarFiltros();

    // Filtrar por estado activa
    listadoOrdenes.seleccionarEstadoOrden('Activa');
    
    listadoOrdenes.verificarFiltrosAplicados();
    
    // Verificar resultados
    listadoOrdenes.verificarResultadosConTolerancia().then((hasResults) => {
      if (!hasResults) {
        cy.log('No se encontraron resultados después de filtrar por estado Activa');
      }
    });
  });

  it('Validar filtrado de órdenes por empresa en modo orden', () => {
    listadoOrdenes.clickExportacion();
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

  it('Validar filtrado de órdenes por comprador en modo orden', () => {
    listadoOrdenes.clickExportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    cy.wait('@loadOrders', { timeout: 15000 });
    listadoOrdenes.inicializarFiltros();

    // Filtrar por comprador (equivalente a proveedor en exportación)
    listadoOrdenes.seleccionarComprador('Comprador Demo');
    
    listadoOrdenes.verificarFiltrosAplicados();
    listadoOrdenes.verificarResultadosConTolerancia().then((hasResults) => {
      if (!hasResults) {
        cy.log('No se encontraron resultados después de filtrar por comprador');
      }
    });
  });

  it('Validar cambio a modo productos y retorno a modo orden', () => {
    listadoOrdenes.clickExportacion();
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

  it('Validar aplicación de múltiples filtros básicos en modo orden', () => {
    listadoOrdenes.clickExportacion();
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
    listadoOrdenes.clickExportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    cy.wait('@loadOrders', { timeout: 15000 });
    listadoOrdenes.inicializarFiltros();

    // Usar búsqueda general
    listadoOrdenes.usarBusquedaGeneral('OC-', 'Orden');
    
    listadoOrdenes.verificarFiltrosAplicados();
    listadoOrdenes.verificarResultadosConTolerancia();
  });

  it('Validar filtrado por país destino (exportación)', () => {
    listadoOrdenes.clickExportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    cy.wait('@loadOrders', { timeout: 15000 });
    listadoOrdenes.inicializarFiltros();

    // Filtrar por país destino (filtro específico de exportación)
    listadoOrdenes.seleccionarPaisDestino('Chile');
    
    listadoOrdenes.verificarFiltrosAplicados();
    listadoOrdenes.verificarResultadosConTolerancia().then((hasResults) => {
      if (!hasResults) {
        cy.log('No se encontraron resultados después de filtrar por país destino');
      }
    });
  });

  it('Validar descarga de resultados filtrados cuando existen', () => {
    listadoOrdenes.clickExportacion();
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

  it('Validar expansión y uso correcto del panel de filtros', () => {
    listadoOrdenes.clickExportacion();
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

  it('Validar filtrado por producto y SKU en modo orden', () => {
    listadoOrdenes.clickExportacion();
    listadoOrdenes.clickListadoOrdenes();
    
    cy.wait('@loadOrders', { timeout: 15000 });
    listadoOrdenes.inicializarFiltros();

    // Filtrar por producto
    listadoOrdenes.seleccionarProducto('Producto Demo');
    cy.wait(1000);
    
    // Filtrar por SKU
    listadoOrdenes.seleccionarSKU('SKU123');
    
    listadoOrdenes.verificarFiltrosAplicados();
    listadoOrdenes.verificarResultadosConTolerancia().then((hasResults) => {
      if (!hasResults) {
        cy.log('No se encontraron resultados después de filtrar por producto y SKU');
      }
    });
  });
});