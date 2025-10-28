// ============================
// Archivo: generarOrdenVentaNoFraccionada.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Prueba E2E específica para crear órdenes de Venta NO Fraccionadas
// Prueba INDEPENDIENTE de la prueba general de orden de venta
// ============================

import baseData from '../../../fixtures/orders.json';
import { generarDatos } from '../../../support/utils/generadorDatos';
import CrearOrdenVentaNoFraccionadaPage from '../../pages/crearOrdenVentaNoFraccionadaPage';

describe('Dashboard QA - Exportación - Crear Orden Venta EXCLUSIVAMENTE NO Fraccionada', { 
  viewportHeight: 1080, 
  viewportWidth: 1920 
}, () => {

  const crearOrdenVentaNoFraccionada = new CrearOrdenVentaNoFraccionadaPage();
  let orders;

  beforeEach(() => {
    cy.loginPersistent(); 
    orders = generarDatos(baseData);

    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  it('Validar creación EXCLUSIVA de Orden de Venta NO Fraccionada con todos los campos', () => {
    crearOrdenVentaNoFraccionada.clickExportacion();
    crearOrdenVentaNoFraccionada.clickCrearOrdenVenta();

    const order = { 
      ...orders.exportacion,
      fractionada: false 
    };

    crearOrdenVentaNoFraccionada.fillAllFieldsNoFraccionada(order);
    crearOrdenVentaNoFraccionada.saveOrder();
    crearOrdenVentaNoFraccionada.assertOrderCreated();
  });

  it('Validar creación de Orden de Venta NO Fraccionada con valores específicos', () => {
    crearOrdenVentaNoFraccionada.clickExportacion();
    crearOrdenVentaNoFraccionada.clickCrearOrdenVenta();

    const order = { 
      ...orders.exportacion,
      fractionada: false,
      number: `OV-NO-FRACC-EXCLUSIVA-${Date.now()}`,
      totalValue: '45000.00',
      orderDescription: 'Orden de venta EXCLUSIVAMENTE NO fraccionada para productos completos de exportación'
    };

    crearOrdenVentaNoFraccionada.fillAllFieldsNoFraccionada(order);
    crearOrdenVentaNoFraccionada.saveOrder();
    crearOrdenVentaNoFraccionada.assertOrderCreated();
  });

  it('Validar que la orden está marcada como NO Fraccionada antes de guardar', () => {
    crearOrdenVentaNoFraccionada.clickExportacion();
    crearOrdenVentaNoFraccionada.clickCrearOrdenVenta();

    const order = { 
      ...orders.exportacion,
      fractionada: false
    };

    crearOrdenVentaNoFraccionada.fillAllFieldsNoFraccionada(order);
    
    // Verificación EXPLÍCITA del estado NO fraccionado
    crearOrdenVentaNoFraccionada.verifyNoFraccionadaSelected();
    
    crearOrdenVentaNoFraccionada.saveOrder();
    crearOrdenVentaNoFraccionada.assertOrderCreated();
  });

  it('Validar creación de Orden de Venta NO Fraccionada con comprador y contrato específicos', () => {
    crearOrdenVentaNoFraccionada.clickExportacion();
    crearOrdenVentaNoFraccionada.clickCrearOrdenVenta();

    const order = { 
      ...orders.exportacion,
      fractionada: false,
      comprador: 'Comprador Internacional',
      contractNumber: `CONT-NO-FRACC-${Date.now()}`,
      orderClientNumber: `OC-NO-FRACC-${Date.now()}`
    };

    crearOrdenVentaNoFraccionada.fillAllFieldsNoFraccionada(order);
    crearOrdenVentaNoFraccionada.saveOrder();
    crearOrdenVentaNoFraccionada.assertOrderCreated();
  });
});