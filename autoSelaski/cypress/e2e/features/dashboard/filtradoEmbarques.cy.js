
// cypress/e2e/features/dashboard/filtradoEmbarques.cy.js.js
// ============================
// Archivo: filtradoEmbarques.cy.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Pruebas E2E para el filtrado de embarques en Importación y Exportación
// ============================

import filtradoEmbarquesPage from '../../pages/filtradoEmbarquePage';

describe('Dashboard QA - Embarques - Filtrado por Medios y Estados', { 
  viewportHeight: 1080, 
  viewportWidth: 1920 
}, () => {

    const filtradoEmbarques = new filtradoEmbarquesPage();

  beforeEach(() => {
    cy.intercept('POST', '**/api/boardings/**').as('loadBoardings');
    cy.intercept('GET', '**/api/**').as('apiCalls');
    
    cy.loginPersistent();

    cy.window().then(win => {
      if (win.getAllAngularRootElements?.().length > 0) cy.wait(500);
    });
  });

  // TEST 1: Navegación básica
  it('Validar navegación al listado de embarques', () => {
    filtradoEmbarques.inicializarPrueba();
    filtradoEmbarques.verificarURLIncluye('/boardings');
    filtradoEmbarques.verificarResultadosVisibles();
  });

  // TEST 2: Filtros por medio de transporte en Importación
  it('Validar filtrado por medio de transporte en Importación', () => {
    filtradoEmbarques.inicializarPrueba();
    
    const medios = ['Terrestre', 'Aéreo', 'Marítimo', 'Multimodal'];
    
    medios.forEach(medio => {
      cy.log(`Probando medio: ${medio}`);
      filtradoEmbarques.seleccionarMedioTransporte(medio);
      filtradoEmbarques.verificarResultadosVisibles();
      cy.wait(1000);
    });
  });

  // TEST 3: Filtros por estado en Importación
  it('Validar filtrado por estado en Importación', () => {
    filtradoEmbarques.inicializarPrueba();
    
    const estados = ['Atrasados', 'A tiempo', 'Adelantados'];
    
    estados.forEach(estado => {
      cy.log(`Probando estado: ${estado}`);
      filtradoEmbarques.seleccionarEstado(estado);
      filtradoEmbarques.verificarResultadosVisibles();
      cy.wait(1000);
    });
  });

  // TEST 4: Ordenamiento en Importación
  it('Validar ordenamiento de embarques en Importación', () => {
    filtradoEmbarques.inicializarPrueba();
    
    const opcionesOrdenamiento = [
      'ETA',
      'ETD', 
      'Término de Producción Estimado',
      'Arribo a Bodega Estimado'
    ];

    opcionesOrdenamiento.forEach((opcion, index) => {
      cy.log(`Probando ordenamiento por: ${opcion}`);
      
      if (index > 0) {
        filtradoEmbarques.abrirOrdenarPor();
      } else {
        filtradoEmbarques.abrirOrdenarPor();
      }
      
      filtradoEmbarques.seleccionarOpcionOrdenamiento(opcion);
      filtradoEmbarques.verificarResultadosVisibles();
      cy.wait(1500);
    });
  });

  // TEST 5: Filtros combinados en Importación
  it('Validar aplicación de filtros combinados en Importación', () => {
    filtradoEmbarques.inicializarPrueba();
    
    // Combinar medio y estado
    filtradoEmbarques.seleccionarMedioTransporte('Marítimo');
    filtradoEmbarques.seleccionarEstado('Atrasados');
    filtradoEmbarques.verificarResultadosVisibles();
    
    // Cambiar estado manteniendo medio
    filtradoEmbarques.seleccionarEstado('A tiempo');
    filtradoEmbarques.verificarResultadosVisibles();
    
    // Cambiar medio manteniendo estado
    filtradoEmbarques.seleccionarMedioTransporte('Aéreo');
    filtradoEmbarques.verificarResultadosVisibles();
  });

  // TEST 6: Cambio a Exportación y filtros básicos
  it('Validar filtros básicos en modo Exportación', () => {
    filtradoEmbarques.inicializarPrueba();
    
    // Cambiar a Exportación
    filtradoEmbarques.cambiarAExportacion();
    
    // Probar medios en Exportación
    const medios = ['Terrestre', 'Aéreo', 'Marítimo'];
    
    medios.forEach(medio => {
      cy.log(`Probando medio en Exportación: ${medio}`);
      filtradoEmbarques.seleccionarMedioTransporte(medio);
      filtradoEmbarques.verificarResultadosVisibles();
      cy.wait(1000);
    });
    
    // Volver a Importación
    filtradoEmbarques.cambiarAImportacion();
  });

  // TEST 7: Flujo completo Importación → Exportación → Importación
  it('Validar persistencia de filtros al cambiar entre modos', () => {
    filtradoEmbarques.inicializarPrueba();
    
    // Aplicar filtros en Importación
    filtradoEmbarques.seleccionarMedioTransporte('Terrestre');
    filtradoEmbarques.seleccionarEstado('A tiempo');
    filtradoEmbarques.verificarResultadosVisibles();
    
    // Cambiar a Exportación
    filtradoEmbarques.cambiarAExportacion();
    filtradoEmbarques.verificarResultadosVisibles();
    
    // Aplicar filtros en Exportación
    filtradoEmbarques.seleccionarMedioTransporte('Aéreo');
    filtradoEmbarques.seleccionarEstado('Adelantados');
    filtradoEmbarques.verificarResultadosVisibles();
    
    // Volver a Importación
    filtradoEmbarques.cambiarAImportacion();
    filtradoEmbarques.verificarResultadosVisibles();
  });

  // TEST 8: Prueba de rendimiento con múltiples filtros rápidos
  it('Validar manejo de cambios rápidos de filtros (performance)', () => {
    filtradoEmbarques.inicializarPrueba();
    
    // Cambios rápidos entre medios
    for (let i = 0; i < 3; i++) {
      filtradoEmbarques.seleccionarMedioTransporte('Marítimo');
      filtradoEmbarques.verificarResultadosVisibles();
      
      filtradoEmbarques.seleccionarMedioTransporte('Aéreo');
      filtradoEmbarques.verificarResultadosVisibles();
      
      filtradoEmbarques.seleccionarMedioTransporte('Terrestre');
      filtradoEmbarques.verificarResultadosVisibles();
    }
  });

  // TEST 9: Limpieza de filtros
  it('Validar limpieza y reseteo de filtros', () => {
    filtradoEmbarques.inicializarPrueba();
    
    // Aplicar múltiples filtros
    filtradoEmbarques.seleccionarMedioTransporte('Multimodal');
    filtradoEmbarques.seleccionarEstado('Atrasados');
    filtradoEmbarques.verificarResultadosVisibles();
    
    // Recargar página (debería resetear filtros)
    cy.reload();
    cy.wait('@loadBoardings', { timeout: 15000 });
    filtradoEmbarques.verificarResultadosVisibles();
  });

  // TEST 10: Prueba de usabilidad completa
  it('Validar flujo completo de usuario para filtrado de embarques', () => {
    filtradoEmbarques.inicializarPrueba();
    
    cy.log('=== FLUJO COMPLETO DE USUARIO ===');
    
    // Paso 1: Explorar diferentes medios
    ['Marítimo', 'Aéreo', 'Terrestre'].forEach(medio => {
      filtradoEmbarques.seleccionarMedioTransporte(medio);
      filtradoEmbarques.verificarResultadosVisibles();
      cy.wait(500);
    });
    
    // Paso 2: Filtrar por estados
    filtradoEmbarques.seleccionarEstado('A tiempo');
    filtradoEmbarques.verificarResultadosVisibles();
    
    // Paso 3: Ordenar resultados
    filtradoEmbarques.abrirOrdenarPor();
    filtradoEmbarques.seleccionarOpcionOrdenamiento('ETA');
    filtradoEmbarques.verificarResultadosVisibles();
    
    // Paso 4: Cambiar a Exportación
    filtradoEmbarques.cambiarAExportacion();
    filtradoEmbarques.verificarResultadosVisibles();
    
    // Paso 5: Probar en Exportación
    filtradoEmbarques.seleccionarMedioTransporte('Aéreo');
    filtradoEmbarques.verificarResultadosVisibles();
    
    // Paso 6: Volver a Importación
    filtradoEmbarques.cambiarAImportacion();
    filtradoEmbarques.verificarResultadosVisibles();
    
    cy.log('=== FLUJO COMPLETADO EXITOSAMENTE ===');
  });

  // TEST 11: Prueba de bordes - Sin resultados
  it('Validar manejo cuando no hay resultados', () => {
    filtradoEmbarques.inicializarPrueba();
    
    // Intentar combinaciones que podrían no tener resultados
    filtradoEmbarques.seleccionarMedioTransporte('Multimodal');
    filtradoEmbarques.seleccionarEstado('Adelantados');
    filtradoEmbarques.verificarResultadosVisibles(); // Debería funcionar incluso con 0 resultados
  });

  // TEST 12: Prueba de persistencia de sesión
  it('Validar persistencia de sesión durante operaciones de filtrado', () => {
    filtradoEmbarques.inicializarPrueba();
    
    // Realizar múltiples operaciones
    for (let i = 0; i < 5; i++) {
      filtradoEmbarques.seleccionarMedioTransporte(i % 2 === 0 ? 'Marítimo' : 'Aéreo');
      filtradoEmbarques.verificarResultadosVisibles();
    }
    
    // Verificar que seguimos autenticados
    cy.url().should('include', '/dashboard');
  });
});
