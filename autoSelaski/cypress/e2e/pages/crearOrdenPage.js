class CrearOrdenPage {
    // Selectores extraídos del HTML
    selectors = {
        orderNumber: 'input[formcontrolname="OrderNumber"]',
        totalValue: 'input#TotalValue[formcontrolname="TotalValue"]',
        moneda: 'select[formcontrolname="IdMoney"]',
        fechaOC: 'input[formcontrolname="DateTime"]',
        OcCliente: 'input[formcontrolname="ClientOrder"]',
        recepcionOC: 'input[formcontrolname="DateTimeReception"]',
       // formaEnvio: 'select[formcontrolname="IdShippingWay"] option[value="0"]',
        empresa: 'select[formcontrolname="IdBusiness"]',
        puertoOrigen: ':nth-child(1) > :nth-child(7) > div.md\\:col-span-6 > .my-10 > .relative > .col-span-12 > .border',
        productor: 'ng-select[formcontrolname="IdProducer"] input[type="text"]',
        proveedor: 'ng-select[formcontrolname="IdProvider"] input[type="text"]',
        cliente: 'ng-select[formcontrolname="IdClient"] input[type="text"]',
        usuario: 'ng-select[formcontrolname="IdUserByCompany"] input[type="text"]',
        incoterm: 'select[formcontrolname="IdIncoterm"]',
        tagEmpresa: 'select[formcontrolname="IdTag"]',
        puertoDestino: 'app-input-search-async input[title="undefined"]:last',
        numPedido: 'input[formcontrolname="NumPedido"]',
        detallePedido: 'input[formcontrolname="OrderDetails"]',
        clienteInterno: 'ng-select[formcontrolname="IdInternalClient"] input[type="text"]',
        tProduccionPlanificada: 'input[formcontrolname="DeliveryDate"]',
        fechaEntrega: 'input[formcontrolname="EffectiveDeliveryDate"]',
        solicitudETD: 'input[formcontrolname="ETDRequested"]',
        solicitudETA: 'input[formcontrolname="ETARequested"]',
        solicitudBodega: 'input[formcontrolname="WarehouseRequestDate"]',
        fraccionadaNo: 'input[formcontrolname="Fraccionada"][id="fracionada-no"]',
        fraccionadaSi: 'input[formcontrolname="Fraccionada"][id="fracionada-si"]',
        orderNumber: 'input[formcontrolname="OrderNumber"]',
         // ...otros selectores...
        formaEnvio: 'select[formcontrolname="IdShippingWay"]',
        formaEnvioAereo: 'select[formcontrolname="IdShippingWay"] option[value="2"]',
        formaEnvioMaritimo: 'select[formcontrolname="IdShippingWay"] option[value="3"]',
        formaEnvioTerrestre: 'select[formcontrolname="IdShippingWay"] option[value="1"]',
        formaEnvioMaritimoTerrestre: 'select[formcontrolname="IdShippingWay"] option[value="4"]',
        formaEnvioTerrestreMaritimo: 'select[formcontrolname="IdShippingWay"] option[value="5"]',
        empresa: 'select[formcontrolname="IdBusiness"]',
        empresaSelaski: 'select[formcontrolname="IdBusiness"] option[value="277"]',
        empresaPrueba1: 'select[formcontrolname="IdBusiness"] option[value="327"]',
        empresaPrueba2: 'select[formcontrolname="IdBusiness"] option[value="328"]',
        empresaPruebaRevision: 'select[formcontrolname="IdBusiness"] option[value="409"]',
        productor: 'ng-select[formcontrolname="IdProducer"] input[type="text"]',
        comprador: 'ng-select[formcontrolname="IdBuyer"] input[type="text"]',
        incoterm: 'select[formcontrolname="IdIncoterm"]',
        usuario: 'ng-select[formcontrolname="IdUserByCompany"] input[type="text"]',
        tagEmpresa: 'select[formcontrolname="IdTag"]',
        puertoDestino: 'app-input-search-async input[title="undefined"]:last',
        puertoOrigenOpcion: 'div#resultSearch span.col-span-12.cursor-pointer.zoom-in:contains("Carolinensiel, Alemania (DECAR)")',
        // Ejemplo de opciones de tag empresa (puedes agregar más si necesitas seleccionar por valor)
        tagEmpresaGeneral: 'select[formcontrolname="IdTag"] option[value="460"]',
        tagEmpresaPrueba1: 'select[formcontrolname="IdTag"] option[value="476"]',
        tagEmpresaPrueba2: 'select[formcontrolname="IdTag"] option[value="477"]',
        tagEmpresaPrueba3: 'select[formcontrolname="IdTag"] option[value="478"]',
        tagEmpresaMateriaPrima: 'select[formcontrolname="IdTag"] option[value="570"]',
        tagEmpresaRepuestos: 'select[formcontrolname="IdTag"] option[value="573"]',
        productorInput: 'ng-select[formcontrolname="IdProducer"] input[type="text"]',
        productorOpcionImpo: 'div.ng-option span.ng-option-label:contains("Productor IMPO")',
        productorOpcionExpo: 'div.ng-option span.ng-option-label:contains("Productor Expo")',
    };

    escribirFechaOC() {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 2);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        const fechaFormateada = `${dia}/${mes}/${anio}`; // Formato DD/MM/YYYY
        cy.get(this.selectors.fechaOC).clear().type(fechaFormateada);
        return fechaFormateada;
    }
    escribirValorTotalAleatorio() {
        const randomValue = Math.floor(100000 + Math.random() * 900000).toString();
        cy.get(this.selectors.totalValue).clear().type(randomValue);
        return randomValue; // Devuelve el valor por si lo necesitas validar después
    }
    escribirNumeroOC(numero) {
        cy.get(this.selectors.orderNumber).clear().type(numero);
    }

    escribirValorTotal(valor) {
        cy.get(this.selectors.totalValue).clear().type(valor);
    }

    seleccionarMoneda(moneda) {
        cy.get(this.selectors.moneda).select(moneda);
    }

    escribirFechaOC(fecha) {
        cy.get(this.selectors.fechaOC).clear().type(fecha);
    }

    escribirConfirmacionOC(fecha) {
        cy.get(this.selectors.confirmacionOC).clear().type(fecha);
    }

    escribirRecepcionOC(fecha) {
        cy.get(this.selectors.recepcionOC).clear().type(fecha);
    }

    seleccionarFormaEnvio(forma) {
        cy.get(this.selectors.formaEnvio).select(forma);
    }

    seleccionarEmpresa(empresa) {
        cy.get(this.selectors.empresa).select(empresa);
    }

    escribirPuertoOrigen(puerto) {
        cy.get(this.selectors.puertoOrigen).clear().type(puerto);
    }

    seleccionarProductor(productor) {
        cy.get(this.selectors.productor).type(productor);
    }

    seleccionarProveedor(proveedor) {
        cy.get(this.selectors.proveedor).type(proveedor);
    }

    seleccionarCliente(cliente) {
        cy.get(this.selectors.cliente).type(cliente);
    }

    seleccionarUsuario(usuario) {
        cy.get(this.selectors.usuario).type(usuario);
    }

    seleccionarIncoterm(incoterm) {
        cy.get(this.selectors.incoterm).select(incoterm);
    }

    seleccionarTagEmpresa(tag) {
        cy.get(this.selectors.tagEmpresa).select(tag);
    }

    escribirPuertoDestino(puerto) {
        cy.get(this.selectors.puertoDestino).clear().type(puerto);
    }

    escribirNumPedido(num) {
        cy.get(this.selectors.numPedido).clear().type(num);
    }

    escribirDetallePedido(detalle) {
        cy.get(this.selectors.detallePedido).clear().type(detalle);
    }

    seleccionarClienteInterno(cliente) {
        cy.get(this.selectors.clienteInterno).type(cliente);
    }

    escribirTProduccionPlanificada(fecha) {
        cy.get(this.selectors.tProduccionPlanificada).clear().type(fecha);
    }

    escribirFechaEntrega(fecha) {
        cy.get(this.selectors.fechaEntrega).clear().type(fecha);
    }

    escribirSolicitudETD(fecha) {
        cy.get(this.selectors.solicitudETD).clear().type(fecha);
    }

    escribirSolicitudETA(fecha) {
        cy.get(this.selectors.solicitudETA).clear().type(fecha);
    }

    escribirSolicitudBodega(fecha) {
        cy.get(this.selectors.solicitudBodega).clear().type(fecha);
    }

    seleccionarFraccionada(valor) {
        if (valor === 'No') {
            cy.get(this.selectors.fraccionadaNo).check({ force: true });
        } else {
            cy.get(this.selectors.fraccionadaSi).check({ force: true });
        }
    }
     seleccionarFormaEnvioAleatoria() {
        // Valores válidos para forma de envío (excluye "Seleccione" que es 0)
        const opciones = ['1', '2', '3', '4', '5'];
        const valorAleatorio = opciones[Math.floor(Math.random() * opciones.length)];
        cy.get(this.selectors.formaEnvio).select(valorAleatorio);
        return valorAleatorio; // Por si necesitas validar después
    }
    seleccionarEmpresaAleatoria() {
        // Selecciona una opción aleatoria por posición (excluye la primera opción "Seleccione")
        cy.get(this.selectors.empresa).then($select => {
            const opciones = $select.find('option');
            // Excluye la opción 0 (Seleccione), empieza desde 1
            const posicionesValidas = [1, 2, 3, 4]; // 1: Selaski, 2: Empresa prueba 1, 3: Empresa prueba 2, 4: PRUEBA REVISION
            const posicionAleatoria = posicionesValidas[Math.floor(Math.random() * posicionesValidas.length)];
            cy.get(this.selectors.empresa).select(opciones.eq(posicionAleatoria).val());
        });
    }
    seleccionarPuertoOrigenPorBusqueda() {
        // Escribe 'car' en el input de puerto origen y selecciona la primera coincidencia del dropdown
        cy.get(this.selectors.puertoOrigen).clear().type('car');
        cy.wait(2000); // Espera un segundo para que carguen los resultados
        cy.get('div#resultSearch span.col-span-12.cursor-pointer.zoom-in').first().click();
    }
    // Método para llenar el formulario de la orden
    fillOrderForm(order) {
        cy.get(this.selectors.orderNumber).type(order.number);
        this.escribirValorTotal(order.totalValue);
        cy.get(this.selectors.fechaOC).type(order.date);
        // presionar escape
        cy.get(this.selectors.fechaOC).type('{esc}');
        // ingresar campo Oc cliente
        const textoAleatorio = Math.random().toString(36).substring(2, 10);
        cy.get(this.selectors.OcCliente).type(textoAleatorio);
        // seleccionar forma de envio aleatoriamente
        this.seleccionarFormaEnvioAleatoria();
        // seleccionar empresa aleatoriamente
        this.seleccionarEmpresaAleatoria();
        // seleccionar puerto origen por busqueda
        this.seleccionarPuertoOrigenPorBusqueda();
        //seleccionar opcion del puerto de origen
        cy.get(this.selectors.puertoOrigenOpcion).click();
        // clic en productor y seleccionar opcion
        cy.get(this.selectors.productorInput).click();
        cy.get(this.selectors.productorOpcionImpo).click();
        
        

    }
}

export default CrearOrdenPage;