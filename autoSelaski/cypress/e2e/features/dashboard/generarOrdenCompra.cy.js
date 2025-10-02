import DashboardPage from '../../pages/DashboardPage';
import CrearOrdenPage from '../../pages/crearOrdenPage';

describe('Dashboard QA - Exportación', { viewportHeight: 1000, viewportWidth: 1600 }, () => {
  const dashboardPage = new DashboardPage();
  const crearOrden = new CrearOrdenPage();

  beforeEach(() => {
    cy.loginPersistent();
    cy.fixture('orders.json').as('orders');
  });

  it('Crear una Orden de Exportación completa', function () {
    // Navegar y abrir menú de exportación
    cy.wait(2000); // Esperar a que el dashboard cargue completamente
    dashboardPage.clickExportacion();
    dashboardPage.clickCrearOrdenCompra();

    const order = this.orders.exportacion;

    // Llenar formulario y guardar
    crearOrden.fillOrderForm(order);
    dashboardPage.saveOrder();
    dashboardPage.assertOrderCreated();
  });

  it('Crear orden de compra sin campos requeridos', function () {
    dashboardPage.clickImportacion();
    dashboardPage.clickCrearOrdenCompra();

    // No llenamos el formulario
    dashboardPage.saveOrder();

    cy.contains('Este campo es obligatorio').should('be.visible');
  });
});

//<div _ngcontent-qxh-c70="" class="side-menu__title"> Crear Orden de Venta </div>
//<p _ngcontent-qxh-c70="">Exportación</p>