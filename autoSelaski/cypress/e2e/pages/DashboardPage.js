import BasePage from "./BasePage";
import { faker } from '@faker-js/faker';

export class DashboardPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      importMenu: 'div.side-menu__title.arrow',
      exportMenu: 'div.side-menu__title.arrow > p',
      crearOrdenCompraXpath: '//a[@class="side-menu z-50 relative" and @href="/dashboard/export/orders/create"]/div[@class="side-menu__title" and normalize-space(text())="Crear Orden de Venta"]',
      orderNumber: 'input[formcontrolname="OrderNumber"]',
      
    };
  }

  // Click en menú lateral "Exportación" y desplegar submenú si está colapsado
  clickExportacion() {
    cy.get(this.selectors.exportMenu)
      .contains('Exportación')
      .then($menu => {
        // Si el menú padre no está abierto, hacer click para desplegar
        if (!$menu.parent().hasClass('side-menu--open')) {
          cy.wrap($menu).click({ force: true });
        }
      });
  }
  // Click en "Crear Orden Compra" dentro del submenú desplegado
  clickCrearOrdenCompra() {
    cy.xpath(this.selectors.crearOrdenCompraXpath)
      .should('be.visible') // asegurar que sea visible antes de click
      .click();
  }
  // Generar datos aleatorios para una orden de exportación
  generateRandomOrder() {
    const today = new Date();
    const addDays = (days) => {
      const date = new Date(today);
      date.setDate(today.getDate() + days);
      return date.toISOString().split('T')[0];
    };

    return {
      number: faker.string.alphanumeric(10).toUpperCase(),
      totalValue: faker.finance.amount(1000, 20000, 2),
      currency: 'USD',
      date: addDays(0),
      confirmationDate: addDays(1),
      receptionDate: addDays(2),
      shippingWay: 'Marítimo',
      company: faker.company.name(),
      incoterm: 'FOB',
      tag: 'Seleccione',
      fractionada: faker.datatype.boolean(),
      producer: faker.company.name(),
      provider: faker.company.name(),
      customer: faker.person.fullName(),
      user: faker.person.fullName(),
      internalClient: faker.company.name(),
      deliveryDate: addDays(5),
      etdRequested: addDays(3),
      etaRequested: addDays(7),
      warehouseRequestDate: addDays(4),
      numPedido: faker.string.alphanumeric(8).toUpperCase(),
      orderDetails: faker.lorem.sentence()
    };
  }

  // Método para llenar el formulario de la orden
  fillOrderForm(order) {
    cy.get(this.selectors.orderNumber).type(order.number);
    cy.get(this.selectors.totalValue).type(order.totalValue);
    cy.get(this.selectors.currency).select(order.currency);
    cy.get(this.selectors.orderDate).type(order.date);
    cy.get(this.selectors.confirmationDate).type(order.confirmationDate);
    cy.get(this.selectors.receptionDate).type(order.receptionDate);
    cy.get(this.selectors.shippingWay).select(order.shippingWay);
    cy.get(this.selectors.company).type(order.company);
    cy.get(this.selectors.incoterm).select(order.incoterm);
    cy.get(this.selectors.tag).select(order.tag);
    cy.get(this.selectors.fractionada).check(order.fractionada ? 'yes' : 'no');
    cy.get(this.selectors.producer).type(order.producer);
    cy.get(this.selectors.provider).type(order.provider);
    cy.get(this.selectors.customer).type(order.customer);
    cy.get(this.selectors.user).type(order.user);
    cy.get(this.selectors.internalClient).type(order.internalClient);
    cy.get(this.selectors.deliveryDate).type(order.deliveryDate);
    cy.get(this.selectors.etdRequested).type(order.etdRequested);
    cy.get(this.selectors.etaRequested).type(order.etaRequested);
    cy.get(this.selectors.warehouseRequestDate).type(order.warehouseRequestDate);
    cy.get(this.selectors.numPedido).type(order.numPedido);
    cy.get(this.selectors.orderDetails).type(order.orderDetails);
  }

  // Guardar la orden
  saveOrder() {
    cy.get(this.selectors.saveButton).contains('Guardar').click();
  }

  // Validar que la orden se creó correctamente
  assertOrderCreated() {
    cy.contains(this.selectors.successMessage).should('be.visible');
  }

  // Validar mensaje de bienvenida
  assertWelcome(message) {
    cy.contains(message).should('be.visible');
  }
}

export default DashboardPage;
