// ============================
// Archivo: agregarProductoEnOrdenCompra.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Pruebas E2E para agregar productos en órdenes de compra
// Múltiples escenarios con el mismo flujo
// ============================

import CrearProductoEnOrdenCompraPage from '../../pages/crearProductoEnOrdenComprapage';

describe('Dashboard QA - Importación - Agregar Producto en Orden Compra', { 
  viewportHeight: 1080, 
  viewportWidth: 1920 
}, () => {

  const crearProductoPage = new CrearProductoEnOrdenCompraPage();

  beforeEach(() => {
    cy.loginPersistent();
    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  const generarProductoCompletoOrdenCompra = () => {
    const randomId = Math.floor(Math.random() * 10000);
    const fechaHoy = new Date();
    const fechaProd = new Date(fechaHoy);
    fechaProd.setDate(fechaHoy.getDate() + 7);
    
    const fechaETD = new Date(fechaHoy);
    fechaETD.setDate(fechaHoy.getDate() + 10);
    
    const fechaETA = new Date(fechaHoy);
    fechaETA.setDate(fechaHoy.getDate() + 20);
    
    const fechaBodega = new Date(fechaHoy);
    fechaBodega.setDate(fechaHoy.getDate() + 5);

    return {
      descripcion: `Producto QA Orden Compra ${randomId}`,
      posicion: '10',
      sku: `SKU-COMPRA-QA-${randomId}-${Date.now()}`,
      codigoProveedor: `PROV-${randomId}`,
      detalle: `Detalle producto orden compra ${randomId}`,
      nombreComercial: `Marca Proveedor ${randomId}`,
      uso: `Uso industrial ${randomId}`,
      observacion: `Observaciones compra ${randomId}`,
      tProduccionPlanificada: fechaProd.toISOString().split('T')[0],
      etdRequested: fechaETD.toISOString().split('T')[0],
      etaRequested: fechaETA.toISOString().split('T')[0],
      warehouseRequestDate: fechaBodega.toISOString().split('T')[0],
      cantidad: (Math.floor(Math.random() * 100) + 1).toString(),
      qtyBox: (Math.floor(Math.random() * 10) + 1).toString(),
      paquete: `Paquete ${Math.floor(Math.random() * 5) + 1}`,
      pesoNeto: (Math.random() * 50 + 0.5).toFixed(2),
      volumenNeto: (Math.random() * 5 + 0.1).toFixed(3),
      valorUnitario: (Math.random() * 1000 + 10).toFixed(2),
      valorUnitSolic: (Math.random() * 900 + 10).toFixed(2),
      marca: `Marca ${randomId}`,
      centro: `Centro ${randomId}`,
      almacen: `Almacén ${randomId}`
    };
  };

  const generarProductoMinimoOrdenCompra = () => {
    const randomId = Math.floor(Math.random() * 10000);
    const fechaHoy = new Date().toISOString().split('T')[0];

    return {
      descripcion: `Producto Mínimo ${randomId}`,
      posicion: '10',
      sku: `SKU-MIN-${randomId}`,
      codigoProveedor: `PROV-MIN-${randomId}`,
      detalle: 'Detalle mínimo',
      nombreComercial: 'Marca Proveedor',
      uso: 'Uso general',
      observacion: 'Observaciones mínimas',
      tProduccionPlanificada: fechaHoy,
      etdRequested: fechaHoy,
      etaRequested: fechaHoy,
      warehouseRequestDate: fechaHoy,
      cantidad: '5',
      qtyBox: '1',
      paquete: 'Caja',
      pesoNeto: '1.00',
      volumenNeto: '0.100',
      valorUnitario: '50.00',
      valorUnitSolic: '45.00',
      marca: 'Marca',
      centro: 'Centro',
      almacen: 'Almacén'
    };
  };

  const ejecutarFlujoAgregarProducto = (productoPersonalizado = null, escenario = 'completo') => {
    const producto = productoPersonalizado || generarProductoCompletoOrdenCompra();
    
    cy.log(`Iniciando prueba: Agregar Producto - ${escenario}`);

    crearProductoPage.clickImportacion();
    crearProductoPage.clickOrdenCompra();

    cy.contains('h2', 'Productos', { timeout: 15000 }).should('be.visible');

    crearProductoPage.clickAgregarProducto();
    crearProductoPage.fillAllProductFields(producto);
    crearProductoPage.clickAgregar();
    crearProductoPage.assertProductAdded();

    cy.log(`Prueba exitosa: Producto agregado - ${escenario}`);
  };

  it('Validar agregar un producto con todos los campos completos en orden compra', () => {
    ejecutarFlujoAgregarProducto(null, 'completo');
  });

  it('Validar agregar un producto con campos mínimos requeridos en orden compra', () => {
    ejecutarFlujoAgregarProducto(generarProductoMinimoOrdenCompra(), 'mínimo');
  });

  it('Validar agregar un producto con caracteres especiales en orden compra', () => {
    const producto = generarProductoCompletoOrdenCompra();
    producto.descripcion = 'Producto con caractéres especiales: áéíóú ñ Ñ';
    producto.observacion = 'Observación con símbolos: ® © ™';

    ejecutarFlujoAgregarProducto(producto, 'caracteres especiales');
  });

  it('Validar cerrar el modal sin agregar producto en orden compra', () => {
    crearProductoPage.clickImportacion();
    crearProductoPage.clickOrdenCompra();

    cy.contains('h2', 'Productos', { timeout: 15000 }).should('be.visible');
    crearProductoPage.clickAgregarProducto();
    crearProductoPage.waitForModal();
    
    const producto = generarProductoMinimoOrdenCompra();
    crearProductoPage.fillDescripcion(producto.descripcion);
    crearProductoPage.fillSKU(producto.sku);
    
    crearProductoPage.clickCerrar();
    crearProductoPage.assertModalClosed();

    cy.contains('h2', 'Productos').should('be.visible');
  });

  it('Validar validar la estructura del formulario en orden compra', () => {
    crearProductoPage.clickImportacion();
    crearProductoPage.clickOrdenCompra();

    cy.contains('h2', 'Productos', { timeout: 15000 }).should('be.visible');
    crearProductoPage.clickAgregarProducto();
    crearProductoPage.waitForModal();

    cy.get('input[formcontrolname="Description"]').should('exist');
    cy.get('input[formcontrolname="SKU"]').should('exist');
    cy.get('input[formcontrolname="ProviderCode"]').should('exist');
    cy.get('ng-select[bindlabel="CompanyName"]').should('exist');

    crearProductoPage.clickCerrar();
    crearProductoPage.assertModalClosed();
  });

  it('Validar completar el formulario en tiempo razonable', () => {
    const startTime = Date.now();

    ejecutarFlujoAgregarProducto(null, 'performance');

    const executionTime = Date.now() - startTime;
    expect(executionTime).to.be.lessThan(60000);
  });

  afterEach(function() {
    if (this.currentTest.state === 'failed') {
      cy.screenshot(`error-orden-compra-${this.currentTest.title}-${Date.now()}`);
    }
  });
});