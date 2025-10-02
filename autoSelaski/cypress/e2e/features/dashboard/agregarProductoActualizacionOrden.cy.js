import DashboardPage from '../../pages/DashboardPage';
import OrdenPage from '../../pages/OrdenPage';

describe('Agregar producto a una orden existente', () => {
  const dashboardPage = new DashboardPage();
  const ordenPage = new OrdenPage();

  beforeEach(() => {
    cy.login(); // Asegúrate de tener este comando implementado
  });

  it('Debe permitir agregar un producto a una orden existente y reflejar los cambios', () => {
    // 1. Ir al dashboard y buscar la orden a actualizar
    dashboardPage.irAOrdenes();
    dashboardPage.buscarOrdenPorNumero('ORD-12345'); // Cambia por el número de orden real o usa un fixture

    // 2. Seleccionar la orden y entrar en modo edición
    dashboardPage.seleccionarOrden('ORD-12345');
    ordenPage.clickEditarOrden();

    // 3. Agregar un nuevo producto a la orden
    ordenPage.agregarProducto({
      producto: 'Producto Nuevo',
      cantidad: 3
    });

    // 4. Guardar los cambios
    ordenPage.guardarCambios();

    // 5. Validar que el producto agregado aparece en la orden
    ordenPage.validarProductoEnOrden({
      producto: 'Producto Nuevo',
      cantidad: 3
    });
  });
});