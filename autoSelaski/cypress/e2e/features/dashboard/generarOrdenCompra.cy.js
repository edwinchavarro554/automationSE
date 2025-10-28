// ============================
// Archivo: generarOrdenCompra.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Prueba E2E para crear órdenes de Compra con TODOS los campos
// Adaptada para usar Page Object y datos dinámicos desde fixtures
// ============================

import baseData from '../../../fixtures/orders.json';
import { generarDatos } from '../../../support/utils/generadorDatos';
import CrearOrdenCompraPage from '../../pages/crearOrdenCompraPage';

describe('Dashboard QA - Importación - Crear Orden Compra Completa', { viewportHeight: 1080, viewportWidth: 1920 }, () => {

  const crearOrdenCompra = new CrearOrdenCompraPage();
  let orders;

  beforeEach(() => {
    cy.loginPersistent(); 

    orders = generarDatos(baseData);

    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  it('Validar creación de Orden de Compra con todos los campos', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    const order = orders.importacion; 

    crearOrdenCompra.fillAllFields(order);
    crearOrdenCompra.saveOrder();
    crearOrdenCompra.assertOrderCreated();
  });

  it('Validar selección de incoterms al crear O.C.', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    const order = orders.importacion;
    
    // Mapeo correcto de incoterms basado en el HTML proporcionado
    const incoterms = [
      { text: 'EXW', value: '1' },
      { text: 'FCA', value: '2' },
      { text: 'FAS', value: '3' },
      { text: 'FOB', value: '4' },
      { text: 'CPT', value: '5' },
      { text: 'CFR', value: '6' },
      { text: 'CIF', value: '7' },
      { text: 'CIP', value: '8' },
      { text: 'DAP', value: '9' },
      { text: 'DPU', value: '10' },
      { text: 'DDP', value: '11' }
    ];
    
    // Probar los primeros 4 incoterms para no hacer el test demasiado largo
    incoterms.slice(0, 4).forEach(incoterm => {
      cy.log(`Probando incoterm: ${incoterm.text} con valor: ${incoterm.value}`);
      cy.get('select[formcontrolname="IdIncoterm"]')
        .select(incoterm.text)
        .should('have.value', incoterm.value);
    });

    // Crear orden con FOB (valor 4)
    crearOrdenCompra.fillAllFields({...order, incoterm: 'FOB'});
    crearOrdenCompra.saveOrder();
    crearOrdenCompra.assertOrderCreated();
  });

  it('Validar selección de formas de envío al crear O.C.', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    const order = orders.importacion;
    
    const shippingWays = [
      { text: 'Marítimo', value: '3' },
      { text: 'Aéreo', value: '2' },
      { text: 'Terrestre', value: '1' }
    ];
    
    shippingWays.forEach(way => {
      cy.get('select[formcontrolname="IdShippingWay"]')
        .select(way.text)
        .should('have.value', way.value);
    });

    crearOrdenCompra.fillAllFields({...order});
    crearOrdenCompra.saveOrder();
    crearOrdenCompra.assertOrderCreated();
  });

  it('Validar creación de O.C. fraccionada', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    const order = orders.importacion;
    
    crearOrdenCompra.fillAllFields({...order, fractionada: true});
    cy.get('#fracionada-si').should('be.checked');
    crearOrdenCompra.saveOrder();
    crearOrdenCompra.assertOrderCreated();
  });

  it('Validar creación de O.C. no fraccionada', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    const order = orders.importacion;
    
    crearOrdenCompra.fillAllFields({...order, fractionada: false});
    cy.get('#fracionada-no').should('be.checked');
    crearOrdenCompra.saveOrder();
    crearOrdenCompra.assertOrderCreated();
  });

  it('Validar comportamiento de campos obligatorios', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    // Esperar a que cargue el formulario
    cy.get('input[formcontrolname="OrderNumber"]', { timeout: 15000 }).should('be.visible');
    
    // Intentar guardar sin llenar campos obligatorios
    cy.contains('button', 'Guardar').click({ force: true });
    
    // Verificar que permanecemos en la página de creación (no se redirige)
    cy.url().should('include', '/orders/create');
    
    // Verificar campos obligatorios con asterisco
    cy.contains('label', 'Nº O.C *').should('be.visible');
    cy.contains('label', 'Valor Total O.C. *').should('be.visible');
    cy.contains('label', 'Empresa *').should('be.visible');
    cy.contains('label', 'Incoterm *').should('be.visible');
    cy.contains('label', 'Tag empresa *').should('be.visible');
    cy.contains('label', 'Orden Fraccionada *').should('be.visible');
    
    // Verificar que los campos requeridos tienen clase de error
    cy.get('input[formcontrolname="OrderNumber"]')
      .should('have.class', 'ng-invalid');
    cy.get('input[formcontrolname="TotalValue"]')
      .should('have.class', 'ng-invalid');
    cy.get('select[formcontrolname="IdBusiness"]')
      .should('have.class', 'ng-invalid');
    cy.get('select[formcontrolname="IdIncoterm"]')
      .should('have.class', 'ng-invalid');
    cy.get('select[formcontrolname="IdTag"]')
      .should('have.class', 'ng-invalid');
      
    // Verificar que muestra mensaje de error "Campo Requerido"
    cy.contains('div', 'Campo Requerido.').should('be.visible');
  });

  it('Validar creación de O.C. con diferentes valores totales', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    const order = orders.importacion;
    const testValues = ['1000', '5000.50', '100000.75'];
    
    testValues.forEach(value => {
      cy.get('input[formcontrolname="TotalValue"]')
        .clear()
        .type(value, { force: true })
        .should('have.value', value);
    });

    crearOrdenCompra.fillAllFields({...order, totalValue: '10000'});
    crearOrdenCompra.saveOrder();
    crearOrdenCompra.assertOrderCreated();
  });


});