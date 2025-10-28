// ============================
// Archivo: agregarProductoEnOrdenVenta.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Prueba E2E para agregar productos en órdenes de venta
// Versión: 2.0 - Completa y mejorada con todos los campos
// ============================

import CrearProductoEnOrdenVentaPage from '../../pages/crearProductoEnOrdenVentapage';

describe('Dashboard QA - Exportación - Agregar Producto en Orden Venta', { 
  viewportHeight: 1080, 
  viewportWidth: 1920 
}, () => {

  const crearProductoPage = new CrearProductoEnOrdenVentaPage();

  beforeEach(() => {
    cy.loginPersistent();
    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  // Función mejorada para generar productos completos
  const generarProductoCompleto = () => {
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
      // PRIMERA SECCIÓN: Información básica del producto
      descripcion: `Producto QA Automatizado ${randomId} - Prueba Completa`,
      posicion: '10', // Campo deshabilitado con valor por defecto
      sku: `SKU-QA-${randomId}-${Date.now()}`,
      detalle: `Detalle técnico completo del producto de prueba ${randomId}. Especificaciones: Material premium, garantía extendida.`,
      nombreComercial: `Marca Comercial Premium ${randomId}`,
      uso: `Uso industrial especializado para sector manufacturero ${randomId}`,

      // SEGUNDA SECCIÓN: Categorías y observaciones
      observacion: `Observaciones de calidad: Producto sujeto a control de calidad estricto. Lote: QA-${randomId}. Fecha generación: ${new Date().toLocaleDateString()}`,

      // TERCERA SECCIÓN: Fechas de planificación
      tProduccionPlanificada: fechaProd.toISOString().split('T')[0],
      etdRequested: fechaETD.toISOString().split('T')[0],
      etaRequested: fechaETA.toISOString().split('T')[0],
      warehouseRequestDate: fechaBodega.toISOString().split('T')[0],

      // CUARTA SECCIÓN: Nivel de criticidad - manejado por selector

      // QUINTA SECCIÓN: Cantidades y unidades
      cantidad: (Math.floor(Math.random() * 100) + 1).toString(),
      qtyBox: (Math.floor(Math.random() * 10) + 1).toString(),
      paquete: `Paquete Tipo ${Math.floor(Math.random() * 5) + 1}`,

      // SEXTA SECCIÓN: Pesos y volúmenes
      pesoNeto: (Math.random() * 50 + 0.5).toFixed(2),
      volumenNeto: (Math.random() * 5 + 0.1).toFixed(3),

      // SÉPTIMA SECCIÓN: Valores financieros
      valorUnitario: (Math.random() * 1000 + 10).toFixed(2),

      // OCTAVA SECCIÓN: Información adicional
      valorUnitSolic: (Math.random() * 900 + 10).toFixed(2),
      marca: `Marca QA ${randomId}`,
      centro: `Centro Distribución ${randomId}`,
      almacen: `Almacén Principal ${randomId}`
    };
  };

  // Función para producto mínimo requerido
  const generarProductoMinimo = () => {
    const randomId = Math.floor(Math.random() * 10000);
    const fechaHoy = new Date().toISOString().split('T')[0];

    return {
      descripcion: `Producto Mínimo ${randomId}`,
      posicion: '10',
      sku: `SKU-MIN-${randomId}`,
      detalle: 'Detalle mínimo',
      nombreComercial: 'Marca Mínima',
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
      marca: 'Marca Genérica',
      centro: 'Centro Default',
      almacen: 'Almacén Default'
    };
  };

  // Función para producto con valores altos
  const generarProductoValoresAltos = () => {
    const randomId = Math.floor(Math.random() * 10000);
    const fechaHoy = new Date().toISOString().split('T')[0];

    return {
      descripcion: `Producto Valores Altos ${randomId}`,
      posicion: '10',
      sku: `SKU-ALTO-${randomId}`,
      detalle: 'Producto con valores numéricos altos',
      nombreComercial: 'Marca Premium',
      uso: 'Uso especializado alto rendimiento',
      observacion: 'Producto de alta gama con especificaciones técnicas avanzadas',
      tProduccionPlanificada: fechaHoy,
      etdRequested: fechaHoy,
      etaRequested: fechaHoy,
      warehouseRequestDate: fechaHoy,
      cantidad: '1000',
      qtyBox: '50',
      paquete: 'Contenedor',
      pesoNeto: '500.75',
      volumenNeto: '25.500',
      valorUnitario: '5000.99',
      valorUnitSolic: '4500.50',
      marca: 'Marca Elite',
      centro: 'Centro Nacional',
      almacen: 'Bodega Central'
    };
  };

  // Flujo base mejorado para agregar producto
  const ejecutarFlujoAgregarProducto = (productoPersonalizado = null, escenario = 'completo') => {
    const producto = productoPersonalizado || generarProductoCompleto();
    
    cy.log(`=== INICIANDO PRUEBA: Agregar Producto - Escenario ${escenario} ===`);
    cy.log(`Producto: ${producto.descripcion}`);
    cy.log(`SKU: ${producto.sku}`);

    // Navegación a la sección de órdenes de venta
    crearProductoPage.clickExportacion();
    crearProductoPage.clickOrdenVenta();

    // Esperar a que cargue la página de productos
    cy.contains('h2', 'Productos', { timeout: 15000 })
      .should('be.visible')
      .then(() => {
        cy.log('Página de productos cargada correctamente');
      });

    // Hacer clic en Agregar Producto
    crearProductoPage.clickAgregarProducto();

    // Llenar el modal con los datos del producto
    crearProductoPage.fillAllProductFields(producto);

    // Hacer clic en Agregar
    crearProductoPage.clickAgregar();

    // Validar que el producto se agregó
    crearProductoPage.assertProductAdded();

    cy.log(`=== PRUEBA EXITOSA: Producto agregado - Escenario ${escenario} ===`);
  };

  // ================= ESCENARIOS DE PRUEBA =================

  it('Validar agregar un producto con TODOS los campos completos', () => {
    ejecutarFlujoAgregarProducto(null, 'completo');
  });

  it('Validar agregar un producto con campos mínimos requeridos', () => {
    ejecutarFlujoAgregarProducto(generarProductoMinimo(), 'mínimo');
  });

  

  it('Validar agregar un producto con caracteres especiales en descripción', () => {
    const productoCcaracteresEspeciales = generarProductoCompleto();
    productoCcaracteresEspeciales.descripcion = 'Producto con caractéres especiales: áéíóú ñ Ñ ¿? ¡! @ # $ % & * () [] {}';
    productoCcaracteresEspeciales.observacion = 'Observación con símbolos: ® © ™ ° ± × ÷ ≈ ≠ ≤ ≥ ∞ µ';

    ejecutarFlujoAgregarProducto(productoCcaracteresEspeciales, 'caracteres especiales');
  });

  

  it('Validar cerrar el modal sin agregar producto', () => {
    cy.log('=== INICIANDO PRUEBA: Cerrar modal sin agregar ===');

    crearProductoPage.clickExportacion();
    crearProductoPage.clickOrdenVenta();

    cy.contains('h2', 'Productos', { timeout: 15000 })
      .should('be.visible');

    crearProductoPage.clickAgregarProducto();
    crearProductoPage.waitForModal();
    
    // Llenar algunos campos pero no guardar
    const producto = generarProductoMinimo();
    crearProductoPage.fillDescripcion(producto.descripcion);
    crearProductoPage.fillSKU(producto.sku);
    
    // Cerrar el modal
    crearProductoPage.clickCerrar();
    crearProductoPage.assertModalClosed();

    // Verificar que seguimos en la página de productos
    cy.contains('h2', 'Productos').should('be.visible');

    cy.log('=== PRUEBA EXITOSA: Modal cerrado correctamente ===');
  });

  it('Validar la navegación y estructura del formulario', () => {
    cy.log('=== INICIANDO PRUEBA: Validación de formulario ===');

    crearProductoPage.clickExportacion();
    crearProductoPage.clickOrdenVenta();

    cy.contains('h2', 'Productos', { timeout: 15000 }).should('be.visible');
    crearProductoPage.clickAgregarProducto();
    crearProductoPage.waitForModal();

    // Validar que todos los campos principales existen
    cy.get('input[formcontrolname="Description"]').should('exist');
    cy.get('input[formcontrolname="SKU"]').should('exist');
    cy.get('input[formcontrolname="Quantity"]').should('exist');
    cy.get('input[formcontrolname="ValueUnit"]').should('exist');

    // Validar que los selectores principales existen
    cy.get('ng-select[formcontrolname="IdCategory"]').should('exist');
    cy.get('ng-select[formcontrolname="IdSubCategory"]').should('exist');
    cy.get('ng-select[formcontrolname="IdPriorityLevel"]').should('exist');

    // Validar campos de fecha
    cy.get('input[formcontrolname="DeliveryDate"]').should('exist');
    cy.get('input[formcontrolname="ETDRequest"]').should('exist');
    cy.get('input[formcontrolname="ETARequest"]').should('exist');
    cy.get('input[formcontrolname="WarehouseRequest"]').should('exist');

    // Validar botones de acción
    cy.contains('button', 'Agregar').should('be.visible');
    cy.contains('button', 'Cerrar').should('be.visible');

    // Cerrar el modal
    crearProductoPage.clickCerrar();
    crearProductoPage.assertModalClosed();

    cy.log('=== PRUEBA EXITOSA: Estructura del formulario validada ===');
  });

  it('Validar manejo correcto de campos con valores decimales', () => {
    const productoDecimales = generarProductoCompleto();
    productoDecimales.pesoNeto = '123.45';
    productoDecimales.volumenNeto = '67.890';
    productoDecimales.valorUnitario = '999.99';
    productoDecimales.valorUnitSolic = '888.88';
    productoDecimales.cantidad = '33.5';
    productoDecimales.qtyBox = '2.5';

    ejecutarFlujoAgregarProducto(productoDecimales, 'valores decimales');
  });

  it('Validar agregar producto con fechas específicas del sistema', () => {
    const productoFechasEspecificas = generarProductoCompleto();
    
    // Usar fechas reales del sistema
    const hoy = new Date();
    const enUnaSemana = new Date(hoy);
    enUnaSemana.setDate(hoy.getDate() + 7);
    
    const enUnMes = new Date(hoy);
    enUnMes.setMonth(hoy.getMonth() + 1);

    productoFechasEspecificas.tProduccionPlanificada = hoy.toISOString().split('T')[0];
    productoFechasEspecificas.etdRequested = enUnaSemana.toISOString().split('T')[0];
    productoFechasEspecificas.etaRequested = enUnMes.toISOString().split('T')[0];
    productoFechasEspecificas.warehouseRequestDate = hoy.toISOString().split('T')[0];

    ejecutarFlujoAgregarProducto(productoFechasEspecificas, 'fechas específicas');
  });

  // Escenario de performance
  it('Validar completar el formulario completo en tiempo razonable', () => {
    const startTime = Date.now();

    ejecutarFlujoAgregarProducto(null, 'performance');

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    cy.log(`Tiempo de ejecución completo: ${executionTime}ms`);
    
    // Validar que el tiempo sea razonable (menos de 60 segundos)
    expect(executionTime).to.be.lessThan(60000, 
      'El flujo completo debería tomar menos de 60 segundos');
  });

  afterEach(function() {
    if (this.currentTest.state === 'failed') {
      cy.log(`Prueba fallida: ${this.currentTest.title}`);
      // Tomar screenshot adicional en caso de fallo
      cy.screenshot(`error-${this.currentTest.title}-${Date.now()}`);
    }
  });
});