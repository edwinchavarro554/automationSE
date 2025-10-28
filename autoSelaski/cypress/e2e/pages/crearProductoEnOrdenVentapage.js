// ============================
// Archivo: crearProductoEnOrdenVentapage.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Page Object para agregar productos en órdenes de venta
// Versión: 1.5 
// ============================

class CrearProductoEnOrdenVentaPage {

  // ================= MÉTODOS DE NAVEGACIÓN =================

  clickExportacion() {
    cy.get('#mobile-menu-toggler').click({ force: true });
    cy.contains('div.side-menu__title.arrow', 'Exportación').click({ force: true });
    cy.get('ul.menu__sub-open.ml-4', { timeout: 10000 }).should('be.visible');
  }

  clickOrdenVenta() {
    cy.contains('div.side-menu__title', 'Orden de Venta', { timeout: 10000 })
      .click({ force: true });
  }

  clickAgregarProducto() {
    cy.contains('button', 'Agregar Producto', { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  // ================= MÉTODOS DEL MODAL =================

  waitForModal() {
    cy.contains('h2', 'Agregar Producto', { timeout: 15000 })
      .should('be.visible');
    
    cy.get('div.modal__content', { timeout: 10000 })
      .should('be.visible');
  }

  closeModal() {
    cy.log('Cerrando modal...');
    
    // Método 1: Cerrar con la X (icono SVG)
    cy.get('svg.feather-x')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    // Método alternativo: Cerrar con el enlace de cerrar
    cy.get('div.modal__content a[style*="width: 25px"]')
      .click({ force: true });
    
    // Verificar que el modal se cerró
    cy.contains('h2', 'Agregar Producto', { timeout: 10000 })
      .should('not.exist');
    
    cy.log('Modal cerrado correctamente');
  }

  // ================= MÉTODOS DE LLENADO DE CAMPOS =================

  // PRIMERA SECCIÓN: Información básica del producto
  fillDescripcion(descripcion) {
    cy.get('input[formcontrolname="Description"]')
      .clear()
      .type(descripcion, { force: true });
  }

  fillPosicion(posicion) {
    cy.get('input[formcontrolname="Position"]')
      .should('have.value', posicion); // Este campo viene deshabilitado con valor 10
  }

  fillSKU(sku) {
    cy.get('input[formcontrolname="SKU"]')
      .clear()
      .type(sku, { force: true });
  }

  fillDetalle(detalle) {
    cy.get('input[formcontrolname="Detail"]')
      .clear()
      .type(detalle, { force: true });
  }

  fillNombreComercial(nombreComercial) {
    cy.get('input[formcontrolname="BrandName"]')
      .clear()
      .type(nombreComercial, { force: true });
  }

  fillUso(uso) {
    cy.get('input[formcontrolname="UsageDescription"]')
      .clear()
      .type(uso, { force: true });
  }

  // SEGUNDA SECCIÓN: Categorías y observaciones
  selectCategoria() {
    cy.get('ng-select[formcontrolname="IdCategory"]')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.wait(1000);
    
    cy.get('body').then(($body) => {
      if ($body.find('ng-dropdown-panel').length > 0) {
        cy.get('ng-dropdown-panel .ng-option')
          .first()
          .click({ force: true });
      } else {
        cy.get('ng-select[formcontrolname="IdCategory"]')
          .find('input')
          .first()
          .type('{downarrow}', { force: true })
          .wait(500)
          .type('{enter}', { force: true });
      }
    });
  }

  selectSubcategoria() {
    cy.wait(1000);
    cy.get('ng-select[formcontrolname="IdSubCategory"]')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.wait(1000);
    
    cy.get('body').then(($body) => {
      if ($body.find('ng-dropdown-panel').length > 0) {
        cy.get('ng-dropdown-panel .ng-option')
          .first()
          .click({ force: true });
      } else {
        cy.get('ng-select[formcontrolname="IdSubCategory"]')
          .find('input')
          .first()
          .type('{downarrow}', { force: true })
          .wait(500)
          .type('{enter}', { force: true });
      }
    });
  }

  fillObservacion(observacion) {
    cy.get('input[formcontrolname="Observation"]')
      .clear()
      .type(observacion, { force: true });
  }

  // TERCERA SECCIÓN: Fechas de planificación
  fillTProduccionPlanificada(fecha) {
    cy.get('input[formcontrolname="DeliveryDate"]')
      .first()
      .clear({ force: true })
      .type(fecha, { force: true });
  }

  fillSolETD(fecha) {
    cy.get('input[formcontrolname="ETDRequest"]')
      .first()
      .clear({ force: true })
      .type(fecha, { force: true });
  }

  fillSolETA(fecha) {
    cy.get('input[formcontrolname="ETARequest"]')
      .first()
      .clear({ force: true })
      .type(fecha, { force: true });
  }

  fillSolBodega(fecha) {
    cy.get('input[formcontrolname="WarehouseRequest"]')
      .first()
      .clear({ force: true })
      .type(fecha, { force: true });
  }

  // CUARTA SECCIÓN: Nivel de criticidad
  selectNivelCriticidad() {
    cy.get('ng-select[formcontrolname="IdPriorityLevel"]')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.wait(1000);
    
    cy.get('body').then(($body) => {
      if ($body.find('ng-dropdown-panel').length > 0) {
        cy.get('ng-dropdown-panel .ng-option')
          .first()
          .click({ force: true });
      } else {
        cy.get('ng-select[formcontrolname="IdPriorityLevel"]')
          .find('input')
          .first()
          .type('{downarrow}', { force: true })
          .wait(500)
          .type('{enter}', { force: true });
      }
    });
  }

  // QUINTA SECCIÓN: Cantidades y unidades (sección con fondo gris)
  fillCantidad(cantidad) {
    cy.get('input[formcontrolname="Quantity"]')
      .clear()
      .type(cantidad, { force: true });
  }

  selectUnidad() {
    cy.log('Buscando selector de Unidad...');
    
    // Primero buscar el selector específico de unidad
    cy.get('body').then(($body) => {
      const selectoresUnidad = [
        'ng-select[formcontrolname="IdUnit"]',
        'ng-select[bindvalue="IdUnit"]',
        'ng-select[placeholder*="unidad"]',
        'ng-select[placeholder*="Unidad"]',
        'ng-select:contains("Unidad")'
      ];

      let selectorEncontrado = null;

      // Buscar entre los selectores posibles
      selectoresUnidad.forEach(selector => {
        if ($body.find(selector).length > 0 && !selectorEncontrado) {
          selectorEncontrado = selector;
          cy.log(`Selector de unidad encontrado: ${selector}`);
        }
      });

      if (selectorEncontrado) {
        // Intentar seleccionar la unidad
        cy.get(selectorEncontrado)
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });

        cy.wait(1500);

        cy.get('body').then(($body) => {
          if ($body.find('ng-dropdown-panel').length > 0) {
            cy.get('ng-dropdown-panel .ng-option')
              .first()
              .should('be.visible')
              .click({ force: true });
            cy.log('Unidad seleccionada correctamente');
          } else {
            cy.log('Dropdown no se abrió, usando método alternativo');
            cy.get(selectorEncontrado)
              .find('input')
              .first()
              .type('{downarrow}', { force: true })
              .wait(800)
              .type('{enter}', { force: true });
          }
        });
      } else {
        cy.log('No se encontró ningún selector de unidad, buscando cualquier ng-select disponible en esa sección...');
        
        // Si no encuentra unidad específica, usar el primer ng-select disponible en esa sección
        cy.get('div[style*="background: #fbfbfc"] ng-select, div[style*="background: #fbfbfc"] ng-select')
          .first()
          .then(($select) => {
            if ($select.length > 0) {
              cy.wrap($select)
                .scrollIntoView()
                .should('be.visible')
                .click({ force: true });

              cy.wait(1500);

              cy.get('body').then(($body) => {
                if ($body.find('ng-dropdown-panel').length > 0) {
                  cy.get('ng-dropdown-panel .ng-option')
                    .first()
                    .click({ force: true });
                  cy.log('Seleccionado primer ng-select disponible como unidad');
                }
              });
            } else {
              cy.log('No se encontró ningún ng-select para unidad');
            }
          });
      }
    });
  }

  fillQtyBox(qtyBox) {
    cy.get('input[formcontrolname="QtyBox"]')
      .clear()
      .type(qtyBox, { force: true });
  }

  fillPaquete(paquete) {
    cy.get('input[formcontrolname="PackageIdUnit"]')
      .clear()
      .type(paquete, { force: true });
  }

  // SEXTA SECCIÓN: Pesos y volúmenes
  fillPesoNeto(pesoNeto) {
    cy.get('input[formcontrolname="Weight"]')
      .clear()
      .type(pesoNeto, { force: true });
  }

  fillVolumenNeto(volumenNeto) {
    cy.get('input[formcontrolname="Volumen"]')
      .clear()
      .type(volumenNeto, { force: true });
  }

  // SÉPTIMA SECCIÓN: Valores financieros
  fillValorUnitario(valorUnitario) {
    cy.get('input[formcontrolname="ValueUnit"]')
      .clear()
      .type(valorUnitario, { force: true });
  }

  // OCTAVA SECCIÓN: Información adicional
  fillValorUnitSolic(valorUnitSolic) {
    cy.get('input[formcontrolname="ValueUnitRequest"]')
      .clear()
      .type(valorUnitSolic, { force: true });
  }

  fillMarca(marca) {
    cy.get('input[formcontrolname="Mark"]')
      .clear()
      .type(marca, { force: true });
  }

  fillCentro(centro) {
    cy.get('input[formcontrolname="Center"]')
      .clear()
      .type(centro, { force: true });
  }

  fillAlmacen(almacen) {
    cy.get('input[formcontrolname="Warehouse"]')
      .clear()
      .type(almacen, { force: true });
  }

  // ================= MÉTODO PRINCIPAL - ORDEN EXACTO =================

  fillAllProductFields(producto) {
    this.waitForModal();

    // PRIMERA SECCIÓN: Información básica del producto
    cy.log('Llenando información básica del producto...');
    this.fillDescripcion(producto.descripcion);
    this.fillPosicion(producto.posicion);
    this.fillSKU(producto.sku);
    this.fillDetalle(producto.detalle);
    this.fillNombreComercial(producto.nombreComercial);
    this.fillUso(producto.uso);

    // SEGUNDA SECCIÓN: Categorías y observaciones
    cy.log('Seleccionando categorías...');
    this.selectCategoria();
    cy.wait(1000);
    this.selectSubcategoria();
    cy.wait(500);
    this.fillObservacion(producto.observacion);

    // TERCERA SECCIÓN: Fechas de planificación
    cy.log('Llenando fechas de planificación...');
    this.fillTProduccionPlanificada(producto.tProduccionPlanificada);
    this.fillSolETD(producto.etdRequested);
    this.fillSolETA(producto.etaRequested);
    this.fillSolBodega(producto.warehouseRequestDate);

    // CUARTA SECCIÓN: Nivel de criticidad
    cy.log('Seleccionando nivel de criticidad...');
    this.selectNivelCriticidad();
    cy.wait(500);

    // QUINTA SECCIÓN: Cantidades y unidades
    cy.log('Llenando cantidades y unidades...');
    this.fillCantidad(producto.cantidad);
    this.selectUnidad(); // ← CORREGIDO: Ahora sí selecciona unidad
    cy.wait(500);
    this.fillQtyBox(producto.qtyBox);
    this.fillPaquete(producto.paquete);

    // SEXTA SECCIÓN: Pesos y volúmenes
    cy.log('Llenando pesos y volúmenes...');
    this.fillPesoNeto(producto.pesoNeto);
    this.fillVolumenNeto(producto.volumenNeto);

    // SÉPTIMA SECCIÓN: Valores financieros
    cy.log('Llenando valores financieros...');
    this.fillValorUnitario(producto.valorUnitario);

    // OCTAVA SECCIÓN: Información adicional
    cy.log('Llenando información adicional...');
    this.fillValorUnitSolic(producto.valorUnitSolic);
    this.fillMarca(producto.marca);
    this.fillCentro(producto.centro);
    this.fillAlmacen(producto.almacen);

    cy.log('Todos los campos del producto han sido llenados en el orden correcto');
  }

  // ================= MÉTODOS DE ACCIÓN =================

  clickAgregar() {
    cy.log('Haciendo clic en botón Agregar...');
    
    // SOLUCIÓN: Usar el selector específico del botón que proporcionaste
    cy.get('button.ml-auto.mr-5.button.w-24.bg-theme-1.text-white')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true });
    
    cy.log('Clic en Agregar realizado');
  }

  clickCerrar() {
    cy.contains('button', 'Cerrar')
      .click({ force: true });
  }

  // ================= VALIDACIONES =================

  assertProductAdded() {
    cy.log('Validando que el producto fue agregado...');
    
    // Verificar que el producto aparece en la tabla (sin esperar que el modal se cierre)
    cy.get('table.table-report tbody tr', { timeout: 15000 })
      .should('have.length.at.least', 1)
      .then(($rows) => {
        cy.log(`Producto agregado exitosamente. Filas en tabla: ${$rows.length}`);
      });
  }

  // NUEVO MÉTODO: Agregar producto y cerrar modal
  agregarProductoYFinalizar(producto) {
    this.fillAllProductFields(producto);
    this.clickAgregar();
    
    // Esperar un momento para que se procese la adición
    cy.wait(2000);
    
    // Verificar que el producto se agregó
    this.assertProductAdded();
    
    // Cerrar el modal manualmente
    this.closeModal();
    
    // Verificar que el modal se cerró completamente
    this.assertModalClosed();
  }

  assertModalClosed() {
    cy.contains('h2', 'Agregar Producto', { timeout: 10000 })
      .should('not.exist');
    cy.log('Modal cerrado correctamente');
  }
}

export default CrearProductoEnOrdenVentaPage;