import DashboardPage from '../../pages/DashboardPage';
import OrdenPage from '../../pages/OrdenPage';

describe('No debe permitir agregar un producto inválido a una orden existente', () => {
  const dashboardPage = new DashboardPage();
  const ordenPage = new OrdenPage();

  beforeEach(() => {
    cy.login(); // Asegúrate de tener este comando implementado
  });

  it('Debe mostrar un mensaje de error al intentar agregar un producto inválido', () => {
    // 1. Ir al dashboard y buscar la orden a actualizar
    dashboardPage.irAOrdenes();
    dashboardPage.buscarOrdenPorNumero('ORD-12345'); // Cambia por el número de orden real o usa un fixture

    // 2. Seleccionar la orden y entrar en modo edición
    dashboardPage.seleccionarOrden('ORD-12345');
    ordenPage.clickEditarOrden();

    // 3. Intentar agregar un producto inválido (por ejemplo, sin nombre o cantidad negativa)
    ordenPage.agregarProducto({
      producto: '', // Producto inválido (nombre vacío)
      cantidad: -5  // Cantidad inválida
    });

    // 4. Validar que se muestra un mensaje de error y no se agrega el producto
    ordenPage.validarMensajeError('Producto o cantidad inválida');
    ordenPage.validarProductoNoAgregado({
      producto: '',
      cantidad: -5
    });
  });
});