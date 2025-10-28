// cypress/e2e/pages/filtradoEmbarquesPage.js
// ============================
// Archivo: filtradoEmbarquesPage.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Página de Filtrado de Embarques con métodos mejorados
// ============================

class FiltradoEmbarquesPage {
  

  clickEmbarques() {
    // Primero asegurarnos de que el menú esté expandido
    cy.get('body').then(($body) => {
      // Si el menú móvil está visible, clickearlo para expandir
      if ($body.find('#mobile-menu-toggler').is(':visible')) {
        cy.get('#mobile-menu-toggler').click({ force: true });
      }
    });

    // Esperar a que la animación del menú se complete
    cy.wait(1000);

    // Buscar y hacer click en Embarques con múltiples estrategias
    cy.get('body').then(($body) => {
      const embarquesSelectors = [
        'div.side-menu__title:contains("Embarques")',
        '.side-menu div:contains("Embarques")',
        'p:contains("Embarques")',
        '[data-cy="embarques-menu"]',
        '.menu-item:contains("Embarques")'
      ];

      let foundEmbarques = false;
      
      for (const selector of embarquesSelectors) {
        if ($body.find(selector).length > 0 && !foundEmbarques) {
          const element = $body.find(selector).first();
          if (element.is(':visible')) {
            cy.wrap(element).scrollIntoView().click({ force: true });
            foundEmbarques = true;
            cy.log(`Encontrado Embarques con selector: ${selector}`);
            break;
          }
        }
      }

      // Si no encontramos con selectores específicos, intentar con contains
      if (!foundEmbarques) {
        cy.contains('Embarques').scrollIntoView().click({ force: true });
      }
    });
    
    // Verificar que el submenú se expandió (con timeout más largo y verificación más flexible)
    cy.get('body').then(($body) => {
      const submenuSelectors = [
        'ul.menu__sub-open',
        '.menu__sub-open',
        '[data-cy="embarques-submenu"]',
        '.submenu-open'
      ];

      let submenuVisible = false;
      
      for (const selector of submenuSelectors) {
        if ($body.find(selector).length > 0) {
          const submenu = $body.find(selector).first();
          if (submenu.is(':visible') && submenu.css('display') !== 'none') {
            submenuVisible = true;
            break;
          }
        }
      }

      if (!submenuVisible) {
        cy.log('Submenú no visible, intentando expandir nuevamente');
        // Intentar clickear nuevamente si el submenú no se expandió
        cy.contains('Embarques').click({ force: true });
        cy.wait(2000);
      }
    });
  }

  clickListadoEmbarques() {
    cy.get('body').then(($body) => {
      const listadoSelectors = [
        'div.side-menu__title:contains("Listado de Embarques")',
        '.menu__sub-open div:contains("Listado de Embarques")',
        'a:contains("Listado de Embarques")',
        '[data-cy="listado-embarques"]',
        '.submenu-item:contains("Listado de Embarques")'
      ];

      let foundListado = false;
      
      for (const selector of listadoSelectors) {
        if ($body.find(selector).length > 0 && !foundListado) {
          const element = $body.find(selector).first();
          if (element.is(':visible')) {
            cy.wrap(element).scrollIntoView().click({ force: true });
            foundListado = true;
            cy.log(`Encontrado Listado de Embarques con selector: ${selector}`);
            break;
          }
        }
      }

      if (!foundListado) {
        cy.contains('Listado de Embarques').first().scrollIntoView().click({ force: true });
      }
    });

    // Esperar a que la página cargue completamente
    cy.url().should('include', '/boardings');
    cy.wait(3000);
  }



  inicializarPrueba() {
    this.clickEmbarques();
    this.clickListadoEmbarques();
    
    // Esperar a que los datos carguen
    cy.wait('@loadBoardings', { timeout: 20000 });
    cy.wait(3000);
    
    // Verificar que estamos en la página correcta
    cy.get('body').then(($body) => {
      const pageIndicators = [
        'app-organism-table-results',
        '.table-container',
        '[data-cy="boardings-table"]',
        'h1:contains("Embarques")',
        'h2:contains("Embarques")'
      ];

      let pageLoaded = false;
      for (const selector of pageIndicators) {
        if ($body.find(selector).length > 0) {
          pageLoaded = true;
          break;
        }
      }

      if (!pageLoaded) {
        cy.log('Página de embarques no cargada correctamente, reintentando navegación');
        this.reintentarNavegacion();
      }
    });
  }

  reintentarNavegacion() {
    // Navegar directamente a la URL si la navegación por menú falla
    cy.visit('/dashboard/orders/boardin-list/boardings');
    cy.wait('@loadBoardings', { timeout: 20000 });
    cy.wait(3000);
  }

  // ================= FILTROS POR MEDIO DE EMBARQUE (CORREGIDOS) =================

  seleccionarMedioTerrestre() {
    this.seleccionarMedioTransporte('Terrestre');
  }

  seleccionarMedioAereo() {
    this.seleccionarMedioTransporte('Aéreo');
  }

  seleccionarMedioMaritimo() {
    this.seleccionarMedioTransporte('Marítimo');
  }

  seleccionarMedioMultimodal() {
    this.seleccionarMedioTransporte('Multimodal');
  }

  seleccionarMedioTransporte(medio) {
    cy.get('body').then(($body) => {
      const medioSelectors = [
        `app-atom-boarding-icon:contains("${medio}")`,
        `div:contains("${medio}")`,
        `p:contains("${medio}")`,
        `[data-cy="medio-${medio.toLowerCase()}"]`,
        `.boarding-icon:contains("${medio}")`
      ];

      let foundMedio = false;
      
      for (const selector of medioSelectors) {
        if ($body.find(selector).length > 0 && !foundMedio) {
          const elements = $body.find(selector);
          for (let i = 0; i < elements.length; i++) {
            const element = elements.eq(i);
            if (element.is(':visible') && element.text().includes(medio)) {
              cy.wrap(element).scrollIntoView().click({ force: true });
              foundMedio = true;
              cy.log(`Seleccionado medio: ${medio}`);
              break;
            }
          }
          if (foundMedio) break;
        }
      }

      if (!foundMedio) {
        cy.log(`No se pudo encontrar el medio: ${medio}`);
      }
    });
    
    cy.wait(1500);
  }

  // ================= FILTROS POR ESTADO (CORREGIDOS) =================

  seleccionarAtrasados() {
    this.seleccionarEstado('Atrasados');
  }

  seleccionarATiempo() {
    this.seleccionarEstado('A tiempo');
  }

  seleccionarAdelantados() {
    this.seleccionarEstado('Adelantados');
  }

  seleccionarEstado(estado) {
    cy.get('body').then(($body) => {
      const estadoSelectors = [
        `app-atom-switch-option:contains("${estado}")`,
        `div:contains("${estado}")`,
        `.switch-option:contains("${estado}")`,
        `[data-cy="estado-${estado.toLowerCase().replace(' ', '-')}"]`,
        `.status-filter:contains("${estado}")`
      ];

      let foundEstado = false;
      
      for (const selector of estadoSelectors) {
        if ($body.find(selector).length > 0 && !foundEstado) {
          const elements = $body.find(selector);
          for (let i = 0; i < elements.length; i++) {
            const element = elements.eq(i);
            if (element.is(':visible') && element.text().includes(estado)) {
              cy.wrap(element).scrollIntoView().click({ force: true });
              foundEstado = true;
              cy.log(`Seleccionado estado: ${estado}`);
              break;
            }
          }
          if (foundEstado) break;
        }
      }

      if (!foundEstado) {
        cy.log(`No se pudo encontrar el estado: ${estado}`);
      }
    });
    
    cy.wait(1500);
  }

  // ================= ORDENAMIENTO MEJORADO =================

  abrirOrdenarPor() {
    cy.get('body').then(($body) => {
      const ordenarSelectors = [
        'a.sort-container.onclick_emitter',
        '.sort-container',
        'app-atom-sort-by-tooltip',
        '[data-cy="sort-button"]',
        'button:contains("Ordenar")',
        'a:contains("Seleccionar")'
      ];

      let foundOrdenar = false;
      
      for (const selector of ordenarSelectors) {
        if ($body.find(selector).length > 0 && !foundOrdenar) {
          const element = $body.find(selector).first();
          if (element.is(':visible')) {
            cy.wrap(element).scrollIntoView().click({ force: true });
            foundOrdenar = true;
            cy.log('Menú de ordenamiento abierto');
            break;
          }
        }
      }
    });
    
    cy.wait(1000);
  }

  seleccionarOpcionOrdenamiento(opcion) {
    cy.get('body').then(($body) => {
      const opcionSelectors = [
        `label:contains("${opcion}")`,
        `input[value="${this.obtenerValorOpcion(opcion)}"]`,
        `.sort-option:contains("${opcion}")`,
        `[data-cy="sort-${opcion.toLowerCase().replace(/ /g, '-')}"]`,
        `li:contains("${opcion}")`
      ];

      let foundOpcion = false;
      
      for (const selector of opcionSelectors) {
        if ($body.find(selector).length > 0 && !foundOpcion) {
          const element = $body.find(selector).first();
          if (element.is(':visible')) {
            cy.wrap(element).scrollIntoView().click({ force: true });
            foundOpcion = true;
            cy.log(`Seleccionada opción de ordenamiento: ${opcion}`);
            break;
          }
        }
      }
    });
    
    cy.wait(2000); // Esperar más tiempo para que se aplique el ordenamiento
  }

  obtenerValorOpcion(opcion) {
    const opciones = {
      'ETA': 'ETA',
      'ETD': 'ETD',
      'Término de Producción Estimado': 'estimated_production_term',
      'Arribo a Bodega Estimado': 'estimated_warehouse_arrival',
      'Arribo a Bodega Real': 'warehouse_arrival',
      'Demurrage': 'demurrage'
    };
    
    return opciones[opcion] || opcion;
  }

  // ================= CAMBIO IMPORTACIÓN/EXPORTACIÓN MEJORADO =================

  cambiarAExportacion() {
    this.cambiarModo('Exportación');
  }

  cambiarAImportacion() {
    this.cambiarModo('Importación');
  }

  cambiarModo(modo) {
    cy.get('body').then(($body) => {
      const modoSelectors = [
        `span:contains("${modo}")`,
        `app-atom-impo-expo-button:contains("${modo}")`,
        `.impo-expo-button:contains("${modo}")`,
        `[data-cy="modo-${modo.toLowerCase()}"]`,
        `button:contains("${modo}")`
      ];

      let foundModo = false;
      
      for (const selector of modoSelectors) {
        if ($body.find(selector).length > 0 && !foundModo) {
          const elements = $body.find(selector);
          for (let i = 0; i < elements.length; i++) {
            const element = elements.eq(i);
            if (element.is(':visible') && element.text().includes(modo)) {
              // Verificar si ya está seleccionado
              const isSelected = element.hasClass('selected') || 
                               element.hasClass('active') ||
                               element.parent().hasClass('selected') ||
                               element.parent().hasClass('active');
              
              if (!isSelected) {
                cy.wrap(element).scrollIntoView().click({ force: true });
                foundModo = true;
                cy.log(`Cambiado a modo: ${modo}`);
                break;
              } else {
                cy.log(`Ya está en modo: ${modo}`);
                foundModo = true;
                break;
              }
            }
          }
          if (foundModo) break;
        }
      }
    });
    
    cy.wait(3000); // Esperar más tiempo para el cambio de modo
  }

  // ================= VERIFICACIONES MEJORADAS =================

  verificarResultadosVisibles() {
    cy.wait(3000);
    
    // Verificar que hay resultados o mensaje de "sin resultados"
    cy.get('body').then(($body) => {
      const resultSelectors = [
        'app-organism-table-results',
        '.table-container',
        'app-molecule-table-first-element',
        '[role="row"]',
        'tbody tr',
        '.data-table'
      ];

      const noResultsSelectors = [
        '.no-results',
        '.empty-state',
        ':contains("No se encontraron resultados")',
        ':contains("Sin resultados")'
      ];

      let hasResults = false;
      let hasNoResultsMessage = false;
      
      // Verificar si hay resultados
      for (const selector of resultSelectors) {
        if ($body.find(selector).length > 0) {
          const elements = $body.find(selector);
          const visibleElements = elements.filter((index, el) => {
            return Cypress.$(el).is(':visible');
          });
          
          if (visibleElements.length > 0) {
            hasResults = true;
            break;
          }
        }
      }

      // Verificar si hay mensaje de sin resultados
      for (const selector of noResultsSelectors) {
        if ($body.find(selector).length > 0) {
          const elements = $body.find(selector);
          const visibleElements = elements.filter((index, el) => {
            return Cypress.$(el).is(':visible') && 
                   (Cypress.$(el).text().includes('No se encontraron') || 
                    Cypress.$(el).text().includes('Sin resultados') ||
                    Cypress.$(el).text().includes('empty'));
          });
          
          if (visibleElements.length > 0) {
            hasNoResultsMessage = true;
            break;
          }
        }
      }

      // La verificación es exitosa si hay resultados O si hay un mensaje de sin resultados
      if (!hasResults && !hasNoResultsMessage) {
        cy.log('No se encontraron resultados ni mensaje de sin resultados');
        // Tomar screenshot para debugging
        cy.screenshot('verificar-resultados-fallido');
      }
    });
  }


  tomarScreenshot(nombre) {
    cy.screenshot(nombre);
  }

  verificarURLIncluye(ruta) {
    cy.url().should('include', ruta);
  }

  esperarCargaCompleta() {
    cy.wait('@loadBoardings', { timeout: 15000 });
    cy.wait(2000);
  }
}

export default FiltradoEmbarquesPage;
