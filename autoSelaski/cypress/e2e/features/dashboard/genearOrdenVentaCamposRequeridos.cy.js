// ============================
// Archivo: generarOrdenVentaCamposRequeridos.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Prueba E2E para crear órdenes de Venta solo con campos REQUERIDOS
// ============================

import baseData from '../../../fixtures/orders.json';
import { generarDatos } from '../../../support/utils/generadorDatos';
import CrearOrdenVentaCamposRequeridosPage from '../../pages/crearOrdenventaCamposRequeridosPage';
describe('Dashboard QA - Exportación - Crear Orden Venta Solo Campos Requeridos', { 
  viewportHeight: 1080, 
  viewportWidth: 1920 
}, () => {

  const crearOrdenVentaRequeridos = new CrearOrdenVentaCamposRequeridosPage();
  let orders;

  beforeEach(() => {
    cy.loginPersistent(); 

    // Generar datos pero solo usaremos los campos requeridos
    orders = generarDatos(baseData);

    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  it('Validar creación de Orden de Venta usando solo campos requeridos', () => {
    const order = orders.exportacion; 

    // Usar el método rápido que incluye todo el flujo
    crearOrdenVentaRequeridos.crearOrdenVentaSoloRequeridos(order);
  });

  it('Validar presencia y habilitación de campos requeridos', () => {
    crearOrdenVentaRequeridos.clickExportacion();
    crearOrdenVentaRequeridos.clickCrearOrdenVenta();

    // Validar presencia de campos requeridos
    cy.get('input[formcontrolname="OrderNumber"]')
      .should('be.visible')
      .and('not.be.disabled');

    cy.get('input[formcontrolname="TotalValue"]')
      .should('be.visible')
      .and('not.be.disabled');

    cy.get('select[formcontrolname="IdBusiness"]')
      .should('be.visible')
      .and('not.be.disabled');

    cy.get('select[formcontrolname="IdIncoterm"]')
      .should('be.visible')
      .and('not.be.disabled');

    cy.get('select[formcontrolname="IdTag"]')
      .should('be.visible')
      .and('not.be.disabled');

    cy.get('#fracionada-si')
      .should('be.visible')
      .and('not.be.disabled');

    cy.get('#fracionada-no')
      .should('be.visible')
      .and('not.be.disabled');

    cy.log('✅ Todos los campos requeridos están presentes y habilitados');
  });

  it('Validar creación de orden NO fraccionada', () => {
    const order = {
      ...orders.exportacion,
      fractionada: false // Específicamente NO fraccionada
    };

    crearOrdenVentaRequeridos.crearOrdenVentaSoloRequeridos(order);
  });

  it('Validar creación de orden SI fraccionada', () => {
    const order = {
      ...orders.exportacion,
      fractionada: true // Específicamente SI fraccionada
    };

    crearOrdenVentaRequeridos.crearOrdenVentaSoloRequeridos(order);
  });
});