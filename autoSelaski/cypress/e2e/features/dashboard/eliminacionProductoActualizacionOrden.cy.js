import DashboardPage from '../../pages/DashboardPage';
import OrdenPage from '../../pages/OrdenPage';

describe('Eliminar producto de una orden existente', () => {
  const dashboardPage = new DashboardPage();
  const ordenPage = new OrdenPage();

  beforeEach(() => {
    cy.login(); // Asegúrate de tener este comando implementado
  });

  it('Debe permitir eliminar un producto de una orden existente y reflejar los cambios', () => {
    // 1. Ir al dashboard y buscar la orden a actualizar
    dashboardPage.irAOrdenes();
    dashboardPage.buscarOrdenPorNumero('ORD-12345'); // Cambia por el número de orden real o usa un fixture

    // 2. Seleccionar la orden y entrar en modo edición
    dashboardPage.seleccionarOrden('ORD-12345');
    ordenPage.clickEditarOrden();

    // 3. Eliminar el producto de la orden
    ordenPage.eliminarProductoDeOrden({
      producto: 'Producto a eliminar'
    });

    // 4. Guardar los cambios
    ordenPage.guardarCambios();

    // 5. Validar que el producto ya no aparece en la orden
    ordenPage.validarProductoNoEnOrden({
      producto: 'Producto a eliminar'
    });
  });
});