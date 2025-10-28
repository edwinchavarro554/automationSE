// ============================
// Archivo: generarOrdenCompraCamposRequeridos.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Prueba E2E para crear órdenes de Compra con solo campos requeridos
// Adaptada para usar Page Object y datos dinámicos desde fixtures
// ============================

import baseData from '../../../fixtures/orders.json';
import { generarDatos } from '../../../support/utils/generadorDatos';
import CrearOrdenCompraCamposRequeridosPage from '../../pages/crearOrdenCompraCamposRequeridosPage';

describe('Dashboard QA - Importación', { viewportHeight: 1080, viewportWidth: 1920 }, () => {

  const crearOrdenCompra = new CrearOrdenCompraCamposRequeridosPage();
  let orders;

  beforeEach(() => {
    cy.loginPersistent(); 

    orders = generarDatos(baseData);

    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  it('Validar creación de Orden de Compra con solo los campos requeridos', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    const order = orders.importacion; 

    crearOrdenCompra.fillOrderForm(order);
    crearOrdenCompra.saveOrder();
    crearOrdenCompra.assertOrderCreated();
  });

  it('Validar presencia y existencia de campos requeridos', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    // Verificar que todos los campos requeridos con asterisco están presentes
    cy.contains('label', 'Nº O.C *').should('be.visible');
    cy.contains('label', 'Valor Total O.C. *').should('be.visible');
    cy.contains('label', 'Empresa *').should('be.visible');
    cy.contains('label', 'Incoterm *').should('be.visible');
    cy.contains('label', 'Tag empresa *').should('be.visible');
    cy.contains('label', 'Orden Fraccionada *').should('be.visible');

    // Verificar que los elementos de formulario existen
    cy.get('input[formcontrolname="OrderNumber"]').should('exist');
    cy.get('input[formcontrolname="TotalValue"]').should('exist');
    cy.get('select[formcontrolname="IdBusiness"]').should('exist');
    cy.get('select[formcontrolname="IdIncoterm"]').should('exist');
    cy.get('select[formcontrolname="IdTag"]').should('exist');
    cy.get('#fracionada-si').should('exist');
    cy.get('#fracionada-no').should('exist');
  });

  it('Validar creación de orden NO fraccionada', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    const order = orders.importacion; 

    crearOrdenCompra.fillOrderForm({...order, fractionada: false});
    
    // Verificar que NO fraccionada está seleccionada
    cy.get('#fracionada-no').should('be.checked');
    cy.get('#fracionada-si').should('not.be.checked');
    
    crearOrdenCompra.saveOrder();
    crearOrdenCompra.assertOrderCreated();
  });

  it('Validar creación de orden SI fraccionada', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    const order = orders.importacion; 

    crearOrdenCompra.fillOrderForm({...order, fractionada: true});
    
    // Verificar que SI fraccionada está seleccionada
    cy.get('#fracionada-si').should('be.checked');
    cy.get('#fracionada-no').should('not.be.checked');
    
    crearOrdenCompra.saveOrder();
    crearOrdenCompra.assertOrderCreated();
  });

  it('Validar creación con diferentes incoterms requeridos', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    const order = orders.importacion;
    
    // Probar con diferentes incoterms comunes
    const incoterms = ['FOB', 'CIF', 'EXW'];
    
    incoterms.forEach(incoterm => {
      // Limpiar y volver a llenar el formulario para cada incoterm
      cy.get('input[formcontrolname="OrderNumber"]')
        .clear()
        .type(`${order.number}-${incoterm}`, { force: true });
        
      cy.get('input[formcontrolname="TotalValue"]')
        .clear()
        .type(order.totalValue, { force: true });
        
      cy.get('select[formcontrolname="IdBusiness"]')
        .select(order.company);
        
      cy.get('select[formcontrolname="IdIncoterm"]')
        .select(incoterm)
        .should('have.value', crearOrdenCompra.getIncotermValue(incoterm));
        
      crearOrdenCompra.selectTagEmpresa();
      
      cy.get('#fracionada-no').check({ force: true });
      
      // Solo guardar para el último incoterm para no crear múltiples órdenes
      if (incoterm === incoterms[incoterms.length - 1]) {
        crearOrdenCompra.saveOrder();
        crearOrdenCompra.assertOrderCreated();
      }
    });
  });

  it('Validar mensajes de error para campos requeridos vacíos', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    // Intentar guardar sin llenar ningún campo
    crearOrdenCompra.saveOrder();
    
    // Verificar que permanecemos en la página de creación
    cy.url().should('include', '/orders/create');
    
    // Verificar que los campos requeridos muestran estado de error
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
  });

  it('Validar creación de orden con diferentes empresas disponibles', () => {
    crearOrdenCompra.clickImportacion();
    crearOrdenCompra.clickCrearOrdenCompra();

    const order = orders.importacion;
    
    // Obtener todas las opciones de empresa disponibles
    cy.get('select[formcontrolname="IdBusiness"] option').then(($options) => {
      const empresas = [];
      $options.each((index, option) => {
        if (option.value && option.textContent.trim() !== 'Seleccione') {
          empresas.push({
            text: option.textContent.trim(),
            value: option.value
          });
        }
      });
      
      // Probar con las primeras 2 empresas disponibles
      const empresasParaProbar = empresas.slice(0, 2);
      
      empresasParaProbar.forEach((empresa, index) => {
        cy.get('input[formcontrolname="OrderNumber"]')
          .clear()
          .type(`${order.number}-EMP-${index}`, { force: true });
          
        cy.get('input[formcontrolname="TotalValue"]')
          .clear()
          .type(order.totalValue, { force: true });
          
        cy.get('select[formcontrolname="IdBusiness"]')
          .select(empresa.text)
          .should('have.value', empresa.value);
          
        cy.get('select[formcontrolname="IdIncoterm"]')
          .select('FOB');
          
        crearOrdenCompra.selectTagEmpresa();
        
        cy.get('#fracionada-no').check({ force: true });
        
        // Solo guardar para la última empresa
        if (index === empresasParaProbar.length - 1) {
          crearOrdenCompra.saveOrder();
          crearOrdenCompra.assertOrderCreated();
        }
      });
    });
  });
});