// ============================
// Archivo: eliminarProductoEnOrdenVenta.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Prueba E2E para eliminar productos en órdenes de venta
// Versión: 2.0 - Específico para eliminación
// ============================

import EliminarProductoEnOrdenVentaPage from '../../pages/eliminarProductoEnOrdenVentaPage';

describe('Dashboard QA - Exportación - Eliminar Producto en Orden Venta', { 
  viewportHeight: 1080, 
  viewportWidth: 1920 
}, () => {

  const eliminarProductoPage = new EliminarProductoEnOrdenVentaPage();

  beforeEach(() => {
    cy.loginPersistent();
    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  // Función para generar producto que será eliminado
  const generarProductoParaEliminar = () => {
    const randomId = Math.floor(Math.random() * 10000);
    const fechaHoy = new Date().toISOString().split('T')[0];

    return {
      descripcion: `Producto QA Para Eliminar ${randomId}`,
      posicion: '10',
      sku: `QA-DELETE-${randomId}-${Date.now()}`,
      detalle: `Producto creado específicamente para prueba de eliminación ${randomId}`,
      nombreComercial: `Marca Delete ${randomId}`,
      uso: `Uso específico para eliminación ${randomId}`,
      observacion: `Este producto será eliminado en la prueba. ID: ${randomId}`,
      tProduccionPlanificada: fechaHoy,
      etdRequested: fechaHoy,
      etaRequested: fechaHoy,
      warehouseRequestDate: fechaHoy,
      cantidad: '1',
      qtyBox: '1',
      paquete: 'Caja Eliminar',
      pesoNeto: '1.00',
      volumenNeto: '0.100',
      valorUnitario: '100.00',
      valorUnitSolic: '90.00',
      marca: `Marca Delete ${randomId}`,
      centro: `Centro Delete ${randomId}`,
      almacen: `Almacén Delete ${randomId}`
    };
  };

  // Función para crear un producto (necesaria para las pruebas de eliminación)
  const crearProductoParaEliminar = (producto) => {
    cy.log(`Creando producto para eliminación: ${producto.sku}`);
    
    // Navegación
    eliminarProductoPage.clickExportacion();
    eliminarProductoPage.clickOrdenVenta();

    // Esperar a que cargue la página de productos
    cy.contains('h2', 'Productos', { timeout: 20000 })
      .should('be.visible');

    // Crear producto usando los métodos del page object
    eliminarProductoPage.clickAgregarProducto();
    eliminarProductoPage.llenarFormularioProducto(producto);
    eliminarProductoPage.clickBotonAgregar();
    eliminarProductoPage.verificarProductoAgregado();
    eliminarProductoPage.cerrarModalProducto();
    
    cy.log(`Producto ${producto.sku} creado exitosamente para eliminación`);
  };

  // Función base para crear y eliminar producto
  const ejecutarFlujoCrearYEliminarProducto = (productoPersonalizado = null) => {
    const producto = productoPersonalizado || generarProductoParaEliminar();
    
    cy.log(`=== INICIANDO PRUEBA: Crear y Eliminar Producto ===`);
    cy.log(`Producto: ${producto.descripcion}`);
    cy.log(`SKU: ${producto.sku}`);

    // PASO 1: Crear producto para eliminar
    crearProductoParaEliminar(producto);

    cy.log('Producto creado exitosamente, procediendo a eliminación...');

    // PASO 2: ELIMINAR EL PRODUCTO RECIÉN CREADO
    eliminarProductoPage.eliminarProducto(producto.sku);

    cy.log(`=== PRUEBA EXITOSA: Producto eliminado correctamente ===`);
    cy.log(`Producto eliminado: ${producto.sku}`);
  };

  // Función para probar cancelación de eliminación
  const ejecutarFlujoCancelarEliminacion = () => {
    const producto = generarProductoParaEliminar();
    
    cy.log(`=== INICIANDO PRUEBA: Cancelar Eliminación ===`);
    cy.log(`Producto: ${producto.descripcion}`);

    // Crear producto
    crearProductoParaEliminar(producto);

    cy.log('Producto creado, intentando cancelar eliminación...');

    // PASO: Intentar eliminar pero cancelar
    eliminarProductoPage.seleccionarProductoPorSKU(producto.sku);
    eliminarProductoPage.clickBotonEliminar();
    eliminarProductoPage.cancelarEliminacionSiAplica();

    // Verificar que el producto sigue en la tabla
    eliminarProductoPage.verificarProductoEnTabla(producto.sku);

    cy.log(`=== PRUEBA EXITOSA: Eliminación cancelada correctamente ===`);
  };

  // ================= ESCENARIOS DE PRUEBA =================

  it('Validar creación y eliminación exitosa de un producto', () => {
    ejecutarFlujoCrearYEliminarProducto();
  });

  it('Validar cancelación de la eliminación de un producto', () => {
    ejecutarFlujoCancelarEliminacion();
  });

  it('Validar eliminación de producto recién creado con datos completos', () => {
    const productoCompleto = generarProductoParaEliminar();
    productoCompleto.descripcion = 'Producto Completo Para Eliminar';
    productoCompleto.detalle = 'Detalle completo del producto que será eliminado';
    productoCompleto.observacion = 'Producto con todos los campos llenos para prueba de eliminación';
    productoCompleto.cantidad = '10';
    productoCompleto.valorUnitario = '500.50';
    
    ejecutarFlujoCrearYEliminarProducto(productoCompleto);
  });

  it('Validar eliminación múltiple de productos', () => {
    cy.log('=== INICIANDO PRUEBA: Eliminación múltiple de productos ===');

    const productos = [
      generarProductoParaEliminar(),
      generarProductoParaEliminar()
    ];

    // Crear productos
    productos.forEach(producto => {
      crearProductoParaEliminar(producto);
    });

    cy.log('Dos productos creados, procediendo a eliminación múltiple...');

    // Seleccionar y eliminar ambos productos
    eliminarProductoPage.eliminarMultiplesProductos(productos.map(p => p.sku));

    cy.log('=== PRUEBA EXITOSA: Eliminación múltiple completada ===');
  });

  

  afterEach(function() {
    if (this.currentTest.state === 'failed') {
      cy.log(`Prueba fallida: ${this.currentTest.title}`);
      cy.screenshot(`error-eliminar-${this.currentTest.title}-${Date.now()}`);
    }
  });
});