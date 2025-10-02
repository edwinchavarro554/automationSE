import DashboardPage from '../../pages/DashboardPage';
import OrdenPage from '../../pages/OrdenPage';

describe('Actualizar producto en una orden existente', () => {
  const dashboardPage = new DashboardPage();
  const ordenPage = new OrdenPage();

  beforeEach(() => {
    // Asume que tienes un comando de login o lo implementas aquí
    cy.login(); // O el método que uses para autenticarte
  });

  it('Debe actualizar el producto de una orden y reflejar los cambios', () => {
    // 1. Ir al dashboard y buscar la orden a actualizar
    dashboardPage.irAOrdenes();
    dashboardPage.buscarOrdenPorNumero('ORD-12345'); // Cambia por el número de orden real o usa un fixture

    // 2. Seleccionar la orden y entrar en modo edición
    dashboardPage.seleccionarOrden('ORD-12345');
    ordenPage.clickEditarOrden();

    // 3. Actualizar el producto (por ejemplo, cambiar cantidad o producto)
    ordenPage.actualizarProductoEnOrden({
      producto: 'Nuevo Producto',
      cantidad: 10
    });

    // 4. Guardar los cambios
    ordenPage.guardarCambios();

    // 5. Validar que los cambios se reflejan correctamente
    ordenPage.validarProductoActualizadoEnOrden({
      producto: 'Nuevo Producto',
      cantidad: 10
    });
  });
});