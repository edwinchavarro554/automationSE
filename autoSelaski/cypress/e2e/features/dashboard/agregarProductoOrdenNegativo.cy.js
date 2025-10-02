import DashboardPage from '../../pages/DashboardPage';
import OrdenPage from '../../pages/OrdenPage';

describe('No debe permitir agregar un producto inválido durante la creación de una orden', () => {
  const dashboardPage = new DashboardPage();
  const ordenPage = new OrdenPage();

  beforeEach(() => {
    cy.login(); // Asegúrate de tener este comando implementado
  });

  it('Debe mostrar un mensaje de error al intentar agregar un producto inválido en la creación de una orden', () => {
    // 1. Ir a la sección de creación de orden
    dashboardPage.irACrearOrden();

    // 2. Llenar los datos básicos de la orden
    ordenPage.llenarDatosBasicosOrden({
      cliente: 'Cliente QA',
      fecha: '2025-09-24'
    });

    // 3. Intentar agregar un producto inválido (por ejemplo, sin nombre o cantidad negativa)
    ordenPage.agregarProducto({
      producto: '', // Producto inválido (nombre vacío)
      cantidad: -1  // Cantidad inválida
    });

    // 4. Validar que se muestra un mensaje de error y no se agrega el producto
    ordenPage.validarMensajeError('Producto o cantidad inválida');
    ordenPage.validarProductoNoAgregado({
      producto: '',
      cantidad: -1
    });
  });
});