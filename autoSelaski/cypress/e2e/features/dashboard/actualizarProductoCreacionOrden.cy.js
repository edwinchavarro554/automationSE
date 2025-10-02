import DashboardPage from '../../pages/DashboardPage';
import OrdenPage from '../../pages/OrdenPage';

describe('Actualizar producto durante la creación de una orden', () => {
  const dashboardPage = new DashboardPage();
  const ordenPage = new OrdenPage();

  beforeEach(() => {
    cy.login(); // Asegúrate de tener este comando implementado
  });

  it('Debe permitir actualizar el producto antes de guardar la orden', () => {
    // 1. Ir a la sección de creación de orden
    dashboardPage.irACrearOrden();

    // 2. Llenar los datos iniciales de la orden
    ordenPage.llenarDatosBasicosOrden({
      cliente: 'Cliente QA',
      fecha: '2025-09-24'
    });

    // 3. Agregar un producto inicial
    ordenPage.agregarProducto({
      producto: 'Producto Inicial',
      cantidad: 5
    });

    // 4. Actualizar el producto antes de guardar la orden
    ordenPage.actualizarProductoEnCreacion({
      producto: 'Producto Actualizado',
      cantidad: 10
    });

    // 5. Guardar la orden
    ordenPage.guardarOrden();

    // 6. Validar que la orden se creó con el producto actualizado
    ordenPage.validarProductoEnOrden({
      producto: 'Producto Actualizado',
      cantidad: 10
    });
  });
});