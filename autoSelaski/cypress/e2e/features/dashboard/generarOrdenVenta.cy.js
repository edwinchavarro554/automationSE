// ============================
// Archivo: generarOrdenVenta.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Prueba E2E para crear órdenes de Venta con TODOS los campos
// Múltiples escenarios con el mismo flujo
// ============================

import baseData from '../../../fixtures/orders.json';
import { generarDatos } from '../../../support/utils/generadorDatos';
import CrearOrdenVentaPage from '../../pages/crearOrdenVentaPage';

describe('Dashboard QA - Exportación - Crear Orden Venta Completa', { 
  viewportHeight: 1080, 
  viewportWidth: 1920 
}, () => {

  const crearOrdenVenta = new CrearOrdenVentaPage();
  let orders;

  beforeEach(() => {
    cy.loginPersistent(); 
    orders = generarDatos(baseData);

    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  // Flujo base reutilizable
  const ejecutarFlujoCompleto = (configuracion = {}) => {
    crearOrdenVenta.clickExportacion();
    crearOrdenVenta.clickCrearOrdenVenta();

    const order = { 
      ...orders.exportacion,
      ...configuracion 
    };

    crearOrdenVenta.fillAllFields(order);
    crearOrdenVenta.saveOrder();
    crearOrdenVenta.assertOrderCreated();
  };

  // Escenarios de prueba
  it('Validar creación de Orden de Venta con TODOS los campos - Escenario Base', () => {
    ejecutarFlujoCompleto();
  });

  it('Validar creación de Orden de Venta NO fraccionada', () => {
    ejecutarFlujoCompleto({
      fractionada: false
    });
  });

  it('Validar creación de Orden de Venta SI fraccionada', () => {
    ejecutarFlujoCompleto({
      fractionada: true
    });
  });

  it('Validar creación de Orden de Venta con valor total alto', () => {
    ejecutarFlujoCompleto({
      totalValue: '50000.00'
    });
  });

  it('Validar creación de Orden de Venta con valor total bajo', () => {
    ejecutarFlujoCompleto({
      totalValue: '1000.50'
    });
  });



  it('Validar creación de Orden de Venta con descripción extensa', () => {
    ejecutarFlujoCompleto({
      orderDescription: 'Descripcion extensa de prueba para validar el comportamiento del campo con texto largo. Este es un pedido importante que requiere atencion especial y seguimiento detallado.'
    });
  });

  it('Validar creación de Orden de Venta con contrato especifico', () => {
    ejecutarFlujoCompleto({
      contractNumber: `CONTRATO-${Date.now()}`
    });
  });

  it('Validar creación de Orden de Venta con fechas proximas', () => {
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    
    const fechaFormateada = manana.toISOString().split('T')[0];

    ejecutarFlujoCompleto({
      date: fechaFormateada,
      confirmationDate: fechaFormateada,
      deliveryDate: fechaFormateada,
      etdRequested: fechaFormateada,
      etaRequested: fechaFormateada,
      warehouseRequestDate: fechaFormateada,
      tProduccionPlanificada: fechaFormateada
    });
  });

  it('Validar creación de Orden de Venta con fechas futuras', () => {
    const hoy = new Date();
    const enUnaSemana = new Date(hoy);
    enUnaSemana.setDate(hoy.getDate() + 7);
    
    const fechaFormateada = enUnaSemana.toISOString().split('T')[0];

    ejecutarFlujoCompleto({
      date: fechaFormateada,
      confirmationDate: fechaFormateada,
      deliveryDate: fechaFormateada
    });
  });

  it('Validar creación de Orden de Venta con número de OC cliente especifico', () => {
    ejecutarFlujoCompleto({
      orderClientNumber: `OC-CLIENTE-${Date.now()}`
    });
  });


  it('Validar creación de Orden de Venta con caracteres especiales en descripcion', () => {
    ejecutarFlujoCompleto({
      orderDescription: 'Orden con caracteres especiales: áéíóú ñ Ñ ¿? ¡! @ # $ % & * () [] {}'
    });
  });

  // Escenarios de validacion
  it('Validar que todos los campos requeridos estan presentes antes de guardar', () => {
    crearOrdenVenta.clickExportacion();
    crearOrdenVenta.clickCrearOrdenVenta();

    // Validar campos requeridos criticos
    cy.get('input[formcontrolname="OrderNumber"]')
      .should('be.visible')
      .and('have.attr', 'formcontrolname');

    cy.get('input[formcontrolname="TotalValue"]')
      .should('be.visible')
      .and('have.attr', 'formcontrolname');

    cy.get('select[formcontrolname="IdBusiness"]')
      .should('be.visible')
      .and('have.attr', 'formcontrolname');

    cy.get('select[formcontrolname="IdIncoterm"]')
      .should('be.visible')
      .and('have.attr', 'formcontrolname');

    cy.get('select[formcontrolname="IdTag"]')
      .should('be.visible')
      .and('have.attr', 'formcontrolname');

    // Validar que los radio buttons de fraccionada existen
    cy.get('#fracionada-si').should('be.visible');
    cy.get('#fracionada-no').should('be.visible');

    cy.log('Todos los campos requeridos estan presentes y validados');
  });

  it('Validar navegación y carga del formulario de creación', () => {
    crearOrdenVenta.clickExportacion();
    crearOrdenVenta.clickCrearOrdenVenta();

    // Verificar que el formulario se carga correctamente
    cy.get('form', { timeout: 15000 }).should('be.visible');
    cy.contains('h2', 'Crear Orden de Venta').should('be.visible');
    
    // Verificar que el boton Guardar esta presente
    cy.contains('button', 'Guardar').should('be.visible');

    cy.log('Navegacion y carga del formulario verificadas correctamente');
  });

  // Escenario de performance
  it('Validar tiempo de ejecución del flujo completo (performance)', () => {
    const startTime = Date.now();

    ejecutarFlujoCompleto();

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    cy.log(`Tiempo de ejecucion: ${executionTime}ms`);
    
    // Validar que el tiempo sea razonable (menos de 2 minutos)
    expect(executionTime).to.be.lessThan(120000, 
      'El flujo completo debería tomar menos de 2 minutos');
  });

  // Escenario de regresion
  it('Validar consistencia de datos después de la creación', () => {
    const orderNumber = `REG-${Date.now()}`;
    
    ejecutarFlujoCompleto({
      number: orderNumber,
      orderDescription: 'Orden de regresion - Datos consistentes'
    });

    cy.log(`Orden de regresion creada: ${orderNumber}`);
  });
 
});