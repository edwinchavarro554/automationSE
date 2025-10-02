import DashboardPage from '../../pages/DashboardPage';
import OrdenPage from '../../pages/OrdenPage';

describe('Crear una orden de compra no fraccionada', () => {
  const dashboardPage = new DashboardPage();
  const ordenPage = new OrdenPage();

  beforeEach(() => {
    cy.login(); // Asegúrate de tener este comando implementado
  });

  it('Debe permitir crear una orden de compra no fraccionada correctamente', () => {
    // 1. Ir a la sección de creación de orden de compra
    dashboardPage.irACrearOrdenCompra();

    // 2. Llenar los datos básicos de la orden
    ordenPage.llenarDatosBasicosOrden({
      cliente: 'Cliente QA',
      fecha: '2025-09-24',
      fraccionada: false // Indica que la orden NO es fraccionada
    });

    // 3. Agregar un producto a la orden
    ordenPage.agregarProducto({
      producto: 'Producto QA',
      cantidad: 5
    });

    // 4. Guardar la orden
    ordenPage.guardarOrden();

    // 5. Validar que la orden se creó correctamente y no está fraccionada
    ordenPage.validarOrdenNoFraccionada({
      cliente: 'Cliente QA',
      producto: 'Producto QA',
      cantidad: 5
    });
  });
});