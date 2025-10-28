// ============================
// Archivo: generarOrdenCompraNoFraccionada.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Prueba E2E específica para crear órdenes de Compra NO Fraccionadas
// Prueba INDEPENDIENTE de la prueba general de orden de compra
// ============================

import baseData from '../../../fixtures/orders.json';
import { generarDatos } from '../../../support/utils/generadorDatos';
import CrearOrdenCompraNoFraccionadaPage from '../../pages/crearOrdenCompraNoFraccionadaPage';

describe('Dashboard QA - Importación - Crear Orden Compra EXCLUSIVAMENTE NO Fraccionada', { 
  viewportHeight: 1080, 
  viewportWidth: 1920 
}, () => {

  const crearOrdenCompraNoFraccionada = new CrearOrdenCompraNoFraccionadaPage();
  let orders;

  beforeEach(() => {
    cy.loginPersistent(); 
    orders = generarDatos(baseData);

    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  it('Validar creación exclusiva de O.C. NO fraccionada con todos los campos', () => {
    crearOrdenCompraNoFraccionada.clickImportacion();
    crearOrdenCompraNoFraccionada.clickCrearOrdenCompra();

    const order = { 
      ...orders.importacion,
      fractionada: false 
    };

    crearOrdenCompraNoFraccionada.fillAllFieldsNoFraccionada(order);
    crearOrdenCompraNoFraccionada.saveOrder();
    crearOrdenCompraNoFraccionada.assertOrderCreated();
  });

  it('Validar creación de O.C. NO fraccionada con valores específicos', () => {
    crearOrdenCompraNoFraccionada.clickImportacion();
    crearOrdenCompraNoFraccionada.clickCrearOrdenCompra();

    const order = { 
      ...orders.importacion,
      fractionada: false,
      number: `OC-NO-FRACC-EXCLUSIVA-${Date.now()}`,
      totalValue: '35000.00',
      orderDescription: 'Orden de compra EXCLUSIVAMENTE NO fraccionada para productos completos sin división'
    };

    crearOrdenCompraNoFraccionada.fillAllFieldsNoFraccionada(order);
    crearOrdenCompraNoFraccionada.saveOrder();
    crearOrdenCompraNoFraccionada.assertOrderCreated();
  });

  it('Validar que la orden está marcada como NO fraccionada antes de guardar', () => {
    crearOrdenCompraNoFraccionada.clickImportacion();
    crearOrdenCompraNoFraccionada.clickCrearOrdenCompra();

    const order = { 
      ...orders.importacion,
      fractionada: false
    };

    crearOrdenCompraNoFraccionada.fillAllFieldsNoFraccionada(order);
    
    // Verificación explícita del estado NO fraccionado
    crearOrdenCompraNoFraccionada.verifyNoFraccionadaSelected();
    
    crearOrdenCompraNoFraccionada.saveOrder();
    crearOrdenCompraNoFraccionada.assertOrderCreated();
  });


});