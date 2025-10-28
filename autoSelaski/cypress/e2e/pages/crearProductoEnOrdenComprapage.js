// ============================
// Archivo: crearProductoEnOrdenComprapage.js
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Page Object para órdenes de compra
// Cristian Bonelo - Oct 2025
// ============================

class CrearProductoEnOrdenCompraPage {
  clickImportacion() {
    cy.get('#mobile-menu-toggler').click({ force: true });
    cy.contains('div.side-menu__title.arrow', 'Importación').click({ force: true });
    cy.get('ul.menu__sub-open.ml-4', { timeout: 10000 }).should('be.visible');
  }

  clickOrdenCompra() {
    cy.contains('div.side-menu__title', 'Orden de Compra', { timeout: 10000 })
      .click({ force: true });
  }

  clickAgregarProducto() {
    cy.contains('button', 'Agregar Producto', { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  waitForModal() {
    cy.contains('h2', 'Agregar Producto', { timeout: 15000 }).should('be.visible');
    cy.get('div.modal__content', { timeout: 10000 }).should('be.visible');
  }

  closeModal() {
    cy.get('svg.feather-x')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.contains('h2', 'Agregar Producto', { timeout: 10000 }).should('not.exist');
  }

  // Método genérico para seleccionar opciones en ng-select
  _seleccionarOpcion(selector) {
    cy.get(selector)
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.wait(1000);
    
    // Intentar diferentes métodos para abrir el dropdown
    cy.get('body').then(($body) => {
      // Método 1: Si el dropdown panel está visible
      if ($body.find('ng-dropdown-panel').length > 0) {
        cy.get('ng-dropdown-panel .ng-option')
          .first()
          .should('be.visible')
          .click({ force: true });
      } 
      // Método 2: Usar teclado si el dropdown no se abre
      else {
        cy.get(selector)
          .find('input')
          .first()
          .type('{downarrow}', { force: true })
          .wait(500)
          .type('{enter}', { force: true });
      }
    });
  }

  fillCodigoProveedor(codigoProveedor) {
    cy.get('input[formcontrolname="ProviderCode"]')
      .clear()
      .type(codigoProveedor, { force: true });
  }

  selectCliente() {
    this._seleccionarOpcion('ng-select[bindlabel="CompanyName"][bindvalue="CompanyName"]');
  }

  fillDescripcion(descripcion) {
    cy.get('input[formcontrolname="Description"]')
      .clear()
      .type(descripcion, { force: true });
  }

  fillPosicion(posicion) {
    cy.get('input[formcontrolname="Position"]')
      .should('have.value', posicion);
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

  selectCategoria() {
    this._seleccionarOpcion('ng-select[formcontrolname="IdCategory"]');
  }

  selectSubcategoria() {
    cy.wait(1000);
    this._seleccionarOpcion('ng-select[formcontrolname="IdSubCategory"]');
  }

  fillObservacion(observacion) {
    cy.get('input[formcontrolname="Observation"]')
      .clear()
      .type(observacion, { force: true });
  }

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

  selectNivelCriticidad() {
    this._seleccionarOpcion('ng-select[formcontrolname="IdPriorityLevel"]');
  }

  fillCantidad(cantidad) {
    cy.get('input[formcontrolname="Quantity"]')
      .clear()
      .type(cantidad, { force: true });
  }

  selectUnidad() {
    this._seleccionarOpcion('ng-select[bindvalue="IdUnit"]');
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

  fillValorUnitario(valorUnitario) {
    cy.get('input[formcontrolname="ValueUnit"]')
      .clear()
      .type(valorUnitario, { force: true });
  }

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

  fillAllProductFields(producto) {
    this.waitForModal();

    // Información básica
    this.fillDescripcion(producto.descripcion);
    this.fillPosicion(producto.posicion);
    this.fillSKU(producto.sku);
    this.fillCodigoProveedor(producto.codigoProveedor);
    this.fillDetalle(producto.detalle);
    this.selectCliente();
    this.fillNombreComercial(producto.nombreComercial);
    this.fillUso(producto.uso);

    // Categorías
    this.selectCategoria();
    cy.wait(1000);
    this.selectSubcategoria();
    cy.wait(500);
    this.fillObservacion(producto.observacion);

    // Fechas
    this.fillTProduccionPlanificada(producto.tProduccionPlanificada);
    this.fillSolETD(producto.etdRequested);
    this.fillSolETA(producto.etaRequested);
    this.fillSolBodega(producto.warehouseRequestDate);

    // Nivel de criticidad
    this.selectNivelCriticidad();
    cy.wait(500);

    // Cantidades y unidades
    this.fillCantidad(producto.cantidad);
    this.selectUnidad();
    cy.wait(500);
    this.fillQtyBox(producto.qtyBox);
    this.fillPaquete(producto.paquete);

    // Pesos y volúmenes
    this.fillPesoNeto(producto.pesoNeto);
    this.fillVolumenNeto(producto.volumenNeto);

    // Valores
    this.fillValorUnitario(producto.valorUnitario);
    this.fillValorUnitSolic(producto.valorUnitSolic);

    // Información adicional
    this.fillMarca(producto.marca);
    this.fillCentro(producto.centro);
    this.fillAlmacen(producto.almacen);
  }

  clickAgregar() {
    cy.get('button.ml-auto.mr-5.button.w-24.bg-theme-1.text-white')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  clickCerrar() {
    cy.contains('button', 'Cerrar').click({ force: true });
  }

  assertProductAdded() {
    cy.get('.loader, .spinner, [class*="loading"]', { timeout: 15000 })
      .should('not.exist');
    
    cy.get('table.table-report tbody tr', { timeout: 15000 })
      .should('have.length.at.least', 1);
  }

  assertModalClosed() {
    cy.contains('h2', 'Agregar Producto', { timeout: 10000 })
      .should('not.exist');
  }
}

export default CrearProductoEnOrdenCompraPage;