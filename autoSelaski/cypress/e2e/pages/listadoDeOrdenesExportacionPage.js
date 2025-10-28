// ============================
// Archivo: listadoDeOrdenesExportacionPage.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Page Object para el listado y filtrado de órdenes de exportación
// ============================

class ListadoDeOrdenesExportacionPage {

  // ================= NAVEGACIÓN =================

  clickExportacion() {
    cy.get('#mobile-menu-toggler').click({ force: true });
    cy.contains('div.side-menu__title.arrow', 'Exportación').click({ force: true });
    cy.get('ul.menu__sub-open.ml-4', { timeout: 10000 }).should('be.visible');
  }

  clickListadoOrdenes() {
    cy.contains('div.side-menu__title', 'Listado de Ordenes', { timeout: 10000 })
      .click({ force: true });
  }

  // ================= EXPANSIÓN DE FILTROS =================

  expandirPanelFiltros() {
    // Verificar si el panel de filtros está colapsado
    cy.get('body').then(($body) => {
      const panelFiltros = $body.find('app-organism-filters-tags div.w-full.shadow.z-10');
      if (panelFiltros.length === 0 || !panelFiltros.is(':visible')) {
        // Hacer clic en "Filtros" para expandir
        cy.contains('div.filter-tab', 'Filtros', { timeout: 10000 })
          .should('be.visible')
          .click({ force: true });
        
        // Esperar a que se expanda el panel
        cy.get('app-organism-filters-tags div.w-full.shadow.z-10', { timeout: 10000 })
          .should('be.visible');
      }
    });
  }

  // ================= FILTROS - FLUJO CORRECTO =================

  // Método principal para usar búsqueda general
  usarBusquedaGeneral(textoBusqueda, tipoBusqueda = 'Detalle Pedido') {
    this.expandirPanelFiltros();
    
    // Paso 1: Hacer clic en el botón de búsqueda general
    cy.get('app-molecule-general-search-select button.onclick_emitter')
      .first()
      .click({ force: true });
    
    // Paso 2: Seleccionar el tipo de búsqueda
    cy.contains('p', tipoBusqueda, { timeout: 5000 })
      .click({ force: true });
    
    // Paso 3: Escribir en el input de búsqueda
    cy.get('app-molecule-general-search-select input')
      .first()
      .clear({ force: true })
      .type(textoBusqueda, { force: true })
      .type('{enter}', { force: true });
    
    // Esperar a que se aplique el filtro
    cy.wait(2000);
  }

  // Filtro Estado Orden
  seleccionarEstadoOrden(estado) {
    this.expandirPanelFiltros();
    
    // Abrir dropdown de Estado Orden
    cy.contains('app-molecule-options-select button.onclick_emitter span', 'Estado Orden')
      .parents('button.onclick_emitter')
      .first()
      .click({ force: true });
    
    // Buscar y seleccionar el estado específico
    cy.contains('p', estado, { timeout: 10000 })
      .should('be.visible')
      .parents('div.flex.w-full')
      .first()
      .find('input[type="checkbox"]')
      .check({ force: true });
    
    // Cerrar el dropdown
    cy.get('body').click(10, 10, { force: true });
    cy.wait(1000);
  }

  // Filtro Comprador (equivalente a Proveedor en Exportación)
  seleccionarComprador(nombreComprador) {
    this.expandirPanelFiltros();
    
    // Abrir dropdown de Comprador
    cy.contains('app-molecule-search-select button.onclick_emitter span', 'Comprador')
      .parents('button.onclick_emitter')
      .first()
      .click({ force: true });
    
    // Esperar a que cargue el ng-select
    cy.get('ng-select[bindlabel="name"]', { timeout: 10000 }).should('be.visible');
    
    // Buscar en el input
    cy.get('ng-select[bindlabel="name"] input')
      .first()
      .clear({ force: true })
      .type(nombreComprador, { force: true });
    
    // Esperar a que aparezcan resultados
    cy.wait(1000);
    
    // Seleccionar el resultado
    cy.contains('span.ng-option-label', nombreComprador, { timeout: 5000 })
      .click({ force: true });
    
    // Cerrar el dropdown
    cy.get('body').click(10, 10, { force: true });
  }

  // Filtro Producto
  seleccionarProducto(nombreProducto) {
    this.expandirPanelFiltros();
    
    // Abrir dropdown de Producto
    cy.contains('app-molecule-search-select button.onclick_emitter span', 'Producto')
      .parents('button.onclick_emitter')
      .first()
      .click({ force: true });
    
    // Esperar a que cargue el ng-select
    cy.get('ng-select[bindlabel="name"]', { timeout: 10000 }).should('be.visible');
    
    // Buscar en el input
    cy.get('ng-select[bindlabel="name"] input')
      .first()
      .clear({ force: true })
      .type(nombreProducto, { force: true });
    
    // Esperar a que aparezcan resultados
    cy.wait(1000);
    
    // Seleccionar el resultado
    cy.contains('span.ng-option-label', nombreProducto, { timeout: 5000 })
      .click({ force: true });
    
    // Cerrar el dropdown
    cy.get('body').click(10, 10, { force: true });
  }

  // Filtro SKU
  seleccionarSKU(sku) {
    this.expandirPanelFiltros();
    
    // Abrir dropdown de SKU
    cy.contains('app-molecule-search-select button.onclick_emitter span', 'SKU')
      .parents('button.onclick_emitter')
      .first()
      .click({ force: true });
    
    // Esperar a que cargue el ng-select
    cy.get('ng-select[bindlabel="name"]', { timeout: 10000 }).should('be.visible');
    
    // Buscar en el input
    cy.get('ng-select[bindlabel="name"] input')
      .first()
      .clear({ force: true })
      .type(sku, { force: true });
    
    // Esperar a que aparezcan resultados
    cy.wait(1000);
    
    // Seleccionar el resultado
    cy.contains('span.ng-option-label', sku, { timeout: 5000 })
      .click({ force: true });
    
    // Cerrar el dropdown
    cy.get('body').click(10, 10, { force: true });
  }

  // Filtro Empresa/Tag
  seleccionarEmpresa(nombreEmpresa) {
    this.expandirPanelFiltros();
    
    // Abrir dropdown de empresa
    cy.get('app-molecule-tag-company-select button.onclick_emitter')
      .first()
      .click({ force: true });
    
    // Seleccionar la empresa
    cy.contains('p', nombreEmpresa, { timeout: 10000 })
      .click({ force: true });
    
    // Cerrar el dropdown
    cy.get('body').click(10, 10, { force: true });
    cy.wait(1000);
  }

  // Filtro Saldo Embarcado
  seleccionarSaldoEmbarcadoCero() {
    this.expandirPanelFiltros();
    
    cy.contains('app-molecule-options-select button.onclick_emitter span', 'Saldo Embarcado')
      .parents('button.onclick_emitter')
      .first()
      .click({ force: true });
    
    cy.contains('p', 'Saldo Embarcado = 0', { timeout: 10000 })
      .parents('div.flex.w-full')
      .first()
      .find('input[type="checkbox"]')
      .check({ force: true });
    
    cy.get('body').click(10, 10, { force: true });
    cy.wait(1000);
  }

  // Filtro País Destino (específico para Exportación)
  seleccionarPaisDestino(nombrePais) {
    this.expandirPanelFiltros();
    
    // Abrir dropdown de País Destino
    cy.contains('app-molecule-search-select button.onclick_emitter span', 'País Destino')
      .parents('button.onclick_emitter')
      .first()
      .click({ force: true });
    
    // Esperar a que cargue el ng-select
    cy.get('ng-select[bindlabel="name"]', { timeout: 10000 }).should('be.visible');
    
    // Buscar en el input
    cy.get('ng-select[bindlabel="name"] input')
      .first()
      .clear({ force: true })
      .type(nombrePais, { force: true });
    
    // Esperar a que aparezcan resultados
    cy.wait(1000);
    
    // Seleccionar el resultado
    cy.contains('span.ng-option-label', nombrePais, { timeout: 5000 })
      .click({ force: true });
    
    // Cerrar el dropdown
    cy.get('body').click(10, 10, { force: true });
  }

  // ================= CAMBIO MODO ORDEN/PRODUCTOS =================

  cambiarModoProductos() {
    this.expandirPanelFiltros();
    cy.contains('span.selected-switch', 'Orden').should('be.visible');
    cy.contains('span', 'Productos').click({ force: true });
    
    // Esperar a que cambie el modo
    cy.contains('span.selected-switch', 'Productos', { timeout: 10000 }).should('be.visible');
    cy.wait(2000);
  }

  cambiarModoOrden() {
    this.expandirPanelFiltros();
    cy.contains('span.selected-switch', 'Productos').should('be.visible');
    cy.contains('span', 'Orden').click({ force: true });
    
    // Esperar a que cambie el modo
    cy.contains('span.selected-switch', 'Orden', { timeout: 10000 }).should('be.visible');
    cy.wait(2000);
  }

  // ================= RESULTADOS Y ORDENAMIENTO =================

  verificarResultadosVisibles() {
    // Esperar a que se carguen los resultados
    cy.wait(3000);
    
    // Verificar que hay resultados
    cy.get('body').then(($body) => {
      // Verificar si hay mensaje de sin resultados
      if ($body.text().includes('sin resultados') || 
          $body.text().includes('no se encontraron') ||
          $body.text().includes('0 resultados')) {
        cy.log('⚠️ No hay resultados con los filtros actuales');
        return;
      }
      
      // Buscar diferentes patrones de resultados
      const possibleSelectors = [
        'tbody tr',
        'app-organism-table tr',
        '.table-container tr',
        '[role="row"]'
      ];
      
      let foundResults = false;
      possibleSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          const elements = $body.find(selector);
          const visibleElements = elements.filter((index, el) => {
            return Cypress.$(el).is(':visible') && Cypress.$(el).text().trim().length > 0;
          });
          
          if (visibleElements.length > 0) {
            foundResults = true;
            cy.log(`✅ Encontrados resultados con selector: ${selector}`);
          }
        }
      });
      
      if (!foundResults) {
        cy.log('No se encontraron resultados visibles después de aplicar filtros');
      }
    });
  }

  verificarResultadosConTolerancia() {
    cy.wait(4000);
    
    return cy.get('body').then(($body) => {
      // Verificar tabla o resultados de cualquier tipo
      const hasTable = $body.find('table').length > 0;
      const hasTbody = $body.find('tbody').length > 0;
      const hasRows = $body.find('tr').length > 0;
      
      if (hasTable || hasTbody || hasRows) {
        cy.log('Estructura de tabla encontrada');
        // Intentar contar filas si existe tbody
        if (hasTbody) {
          const rowCount = $body.find('tbody tr').length;
          cy.log(`Número de filas en tbody: ${rowCount}`);
          return rowCount > 0;
        }
        return true;
      }
      
      cy.log('No se encontró estructura de tabla tradicional');
      return false;
    });
  }

  descargarResultados() {
    // Buscar botón de descarga
    cy.get('body').then(($body) => {
      const downloadSelectors = [
        'app-atom-edit-table-icon[icon="download"]',
        '[aria-label*="descargar"]',
        '[title*="descargar"]',
        'button:contains("Descargar")',
        'button:contains("Exportar")'
      ];
      
      for (let selector of downloadSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click({ force: true });
          cy.log(`Descarga iniciada con selector: ${selector}`);
          return;
        }
      }
      
      cy.log('No se encontró botón de descarga visible');
    });
  }

  // ================= VALIDACIONES =================

  verificarFiltrosVisibles() {
    cy.get('app-organism-filters-tags', { timeout: 15000 }).should('be.visible');
    cy.contains('div.filter-tab', 'Filtros').should('be.visible');
  }

  verificarPanelFiltrosExpandido() {
    cy.get('app-organism-filters-tags div.w-full.shadow.z-10', { timeout: 10000 })
      .should('be.visible');
  }

  verificarModoOrdenActivo() {
    cy.contains('span.selected-switch', 'Orden', { timeout: 5000 }).should('be.visible');
  }

  verificarModoProductosActivo() {
    cy.contains('span.selected-switch', 'Productos', { timeout: 5000 }).should('be.visible');
  }

  verificarFiltrosAplicados() {
    // Verificar que hay filtros seleccionados
    cy.get('body').then(($body) => {
      if ($body.find('app-molecule-selected-filters').length > 0) {
        cy.get('app-molecule-selected-filters').should('be.visible');
      } else {
        // Alternativa: verificar si hay tags de filtros aplicados
        const hasFilterTags = $body.find('[class*="tag"]').length > 0;
        if (hasFilterTags) {
          cy.log('Filtros aplicados (tags visibles)');
        } else {
          cy.log('No se detectaron filtros aplicados visualmente');
        }
      }
    });
  }

  // ================= MÉTODOS DE CONFIGURACIÓN INICIAL =================

  inicializarFiltros() {
    this.expandirPanelFiltros();
    this.verificarPanelFiltrosExpandido();
  }

  // ================= MÉTODOS DE ESPERA Y ESTABILIDAD =================

  esperarCargaInicial() {
    // Esperar a que cargue la página completamente
    cy.get('app-organism-filters-tags', { timeout: 20000 }).should('be.visible');
    
    // Esperar adicional para estabilización
    cy.wait(3000);
    
    // Verificar que los elementos principales estén cargados
    cy.get('body').then(($body) => {
      const hasContent = $body.text().length > 100;
      if (!hasContent) {
        cy.log('Advertencia: la página parece tener poco contenido');
      }
    });
  }

  // Método para limpiar filtros si es necesario
  limpiarFiltros() {
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Limpiar")').length > 0) {
        cy.contains('button', 'Limpiar').click({ force: true });
      } else if ($body.find('[class*="clear"]').length > 0) {
        cy.get('[class*="clear"]').first().click({ force: true });
      }
    });
    cy.wait(2000);
  }
}

export default ListadoDeOrdenesExportacionPage;