import DashboardPage from '../../pages/DashboardPage';
import OrdenPage from '../../pages/OrdenPage';

describe('No debe permitir crear una orden de compra sin campos requeridos', () => {
  const dashboardPage = new DashboardPage();
  const ordenPage = new OrdenPage();

  beforeEach(() => {
    cy.login(); // Asegúrate de tener este comando implementado
  });

  it('Debe mostrar mensajes de error al intentar crear una orden sin completar los campos requeridos', () => {
    // 1. Ir a la sección de creación de orden de compra
    dashboardPage.irACrearOrdenCompra();

    // 2. Intentar guardar la orden sin llenar los campos requeridos
    ordenPage.guardarOrden();

    // 3. Validar que se muestran los mensajes de error para los campos requeridos
    ordenPage.validarMensajeErrorCampoRequerido('cliente');
    ordenPage.validarMensajeErrorCampoRequerido('producto');
    ordenPage.validarMensajeErrorCampoRequerido('cantidad');
    // Agrega más validaciones según los campos requeridos de tu formulario
  });
});