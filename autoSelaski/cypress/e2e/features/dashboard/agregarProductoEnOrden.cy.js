import DashboardPage from '../../pages/DashboardPage';
import OrdenPage from '../../pages/OrdenPage';

describe('Agregar producto durante la creación de una orden', () => {
  const dashboardPage = new DashboardPage();
  const ordenPage = new OrdenPage();

  beforeEach(() => {
    cy.login(); // Asegúrate de tener este comando implementado
  });

  it('Debe permitir agregar un producto al crear una nueva orden', () => {
    // 1. Ir a la sección de creación de orden
    dashboardPage.irACrearOrden();

    // 2. Llenar los datos básicos de la orden
    ordenPage.llenarDatosBasicosOrden({
      cliente: 'Cliente QA',
      fecha: '2025-09-24'
    });

    // 3. Agregar un producto a la orden
    ordenPage.agregarProducto({
      producto: 'Producto QA',
      cantidad: 2
    });

    // 4. Guardar la orden
    ordenPage.guardarOrden();

    // 5. Validar que la orden se creó con el producto agregado
    ordenPage.validarProductoEnOrden({
      producto: 'Producto QA',
      cantidad: 2
    });
  });
});