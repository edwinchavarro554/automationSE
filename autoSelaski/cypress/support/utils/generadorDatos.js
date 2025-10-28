// ============================
// Archivo: generadorDatos.js 
// Proyecto: autoSelaski - QA Automatización Cypress
// Descripción: Módulo mejorado para generar datos dinámicos de prueba para órdenes de Importación y Exportación
// Versión: 3.0 - Completa y Organizada
// Cristian Bonelo - Oct 2025
// ============================

// ================= CONFIGURACIÓN Y CONSTANTES =================
const CONFIG = {
  VERSION: '3.0',
  PROYECTO: 'autoSelaski',
  MONEDA_BASE: 'USD',
  PAIS_BASE: 'Chile',
  CIUDAD_BASE: 'Santiago',
  IVA: 0.19,
  DESCUENTO_BASE: 0.05
};

// ================= FUNCIONES DE UTILIDAD =================
const Utilidades = {
  // Generar números aleatorios
  randomNumber: (min = 1000, max = 9000) => Math.floor(Math.random() * (max - min + 1)) + min,
  
  // Generar valores decimales
  randomValue: (min = 1000, max = 20000) => (Math.random() * (max - min) + min).toFixed(2),
  
  // Generar teléfono
  randomPhone: () => `+56 9 ${Utilidades.randomNumber(1000, 9999)} ${Utilidades.randomNumber(1000, 9999)}`,
  
  // Generar email
  randomEmail: () => `test${Utilidades.randomNumber()}@qa.com`,
  
  // Seleccionar elemento aleatorio de array
  randomFromArray: (array) => array[Math.floor(Math.random() * array.length)],
  
  // Generar booleano aleatorio
  randomBoolean: () => Math.random() > 0.5
};

// ================= DATOS MAESTROS =================
const DatosMaestros = {
  // Usuarios del sistema
  USUARIOS: [
    "Alonso Vega", 
    "Maria Torres", 
    "Carlos Perez", 
    "Lucia Gomez",
    "Roberto Silva",
    "Ana Mendoza",
    "Diego Rojas",
    "Camila Lopez"
  ],

  // Empresas
  EMPRESAS: [
    "Selaski", 
    "Empresa QA A", 
    "Corporacion Test B", 
    "Compañia Demo C",
    "Importadora Global",
    "Exportadora Norte",
    "Comercio Internacional",
    "Distribuidora Sur"
  ],

  // Incoterms disponibles
  INCOTERMS: [
    "FOB", "CIF", "EXW", "DAP", "DDP", 
    "FCA", "CPT", "CIP", "DAT", "DAP"
  ],

  // Formas de envío
  FORMAS_ENVIO: [
    "Aereo", 
    "Maritimo", 
    "Terrestre", 
    "Maritimo-Terrestre", 
    "Terrestre-Maritimo",
    "Multimodal",
    "Express"
  ],

  // Métodos de pago
  METODOS_PAGO: [
    "Anticipado OC", 
    "Anticipado Embarque", 
    "Carta de Credito", 
    "Al Arribo",
    "Contra Entrega",
    "30 Dias Factura",
    "60 Dias Factura",
    "Transferencia Bancaria"
  ],

  // Puertos principales
  PUERTOS: [
    "Valparaiso, Chile (CLVAL)",
    "San Antonio, Chile (CLSAN)", 
    "Buenos Aires, Argentina (ARBUE)",
    "Cali, Colombia (COCLO)",
    "Shanghai, China (CNSHA)",
    "Rotterdam, Netherlands (NLRTM)",
    "Singapore, Singapore (SGSIN)",
    "Hamburg, Germany (DEHAM)",
    "Los Angeles, USA (USLAX)",
    "Santos, Brazil (BRSSZ)"
  ],

  // Productores
  PRODUCTORES: [
    "Productor IMPO", 
    "Productor Internacional", 
    "Manufactura Global",
    "Fabricante Norte",
    "Produccion Sur",
    "Industrias QA"
  ],

  // Proveedores
  PROVEEDORES: [
    "STORA ENSO OYJ", 
    "Proveedor Global SA", 
    "Suministros Internacionales",
    "Materias Primas Corp",
    "Insumos Worldwide",
    "Proveedor Confiable SL"
  ],

  // Clientes
  CLIENTES: [
    "Cliente Internacional", 
    "Cliente Global", 
    "Corporacion Compradora", 
    "Importadora XYZ",
    "Distribuidora ABC",
    "Comercio Exterior SA",
    "Consumidor Final Corp"
  ],

  // Compradores
  COMPRADORES: [
    "Comprador Internacional", 
    "Buyer Global", 
    "International Buyer Corp", 
    "Importadora XYZ",
    "Purchasing Department",
    "Adquisiciones Globales"
  ],

  // Niveles de criticidad
  CRITICIDADES: ["Alta", "Media", "Baja", "Critica", "Normal"],

  // Categorías de productos
  CATEGORIAS: [
    "Producto Prueba", 
    "Materia Prima", 
    "Producto Terminado", 
    "Insumo",
    "Material Peligroso",
    "Producto Perecedero",
    "Electronico",
    "Textil",
    "Alimenticio"
  ],

  // Unidades de medida
  UNIDADES: ['Unidad', 'Kilogramo', 'Litro', 'Metro', 'Caja', 'Pallet', 'Tonelada', 'Galon', 'Pulgada'],

  // Marcas
  MARCAS: ['Marca QA', 'Brand Test', 'Demo Brand', 'Premium Quality', 'Excelencia', 'Calidad Suprema'],

  // Centros de distribución
  CENTROS: ['Centro Norte', 'Centro Sur', 'Centro Este', 'Centro Oeste', 'Centro Principal', 'Centro Logistico'],

  // Almacenes
  ALMACENES: ['Almacen A', 'Almacen B', 'Almacen C', 'Almacen Principal', 'Almacen Secundario', 'Bodega Central'],

  // Tipos de paquete
  PAQUETES: ['Caja Carton', 'Bolsa Plastica', 'Contenedor', 'Sobre', 'Tambor', 'Saco', 'Granel'],

  // Monedas
  MONEDAS: ['USD', 'EUR', 'CLP', 'ARS', 'BRL', 'MXN'],

  // Términos de pago
  TERMINOS_PAGO: ['Contado', '30 dias', '60 dias', '90 dias', 'Anticipado']
};

// ================= MANEJO DE FECHAS =================
const GeneradorFechas = {
  // Fecha actual como punto de referencia
  hoy: new Date(),

  // Generar fecha en formato YYYY-MM-DD para inputs
  fecha: (dias = 0) => {
    const fecha = new Date(GeneradorFechas.hoy);
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split("T")[0];
  },

  // Generar fecha en formato local para descripciones
  fechaCompleta: (dias = 0) => {
    const fecha = new Date(GeneradorFechas.hoy);
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toLocaleDateString('es-CL');
  },

  // Generar fecha y hora para timestamps
  fechaHora: (dias = 0) => {
    const fecha = new Date(GeneradorFechas.hoy);
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString();
  },

  // Rango de fechas para planificación
  rangoFechas: {
    hoy: () => GeneradorFechas.fecha(0),
    manana: () => GeneradorFechas.fecha(1),
    en3Dias: () => GeneradorFechas.fecha(3),
    en5Dias: () => GeneradorFechas.fecha(5),
    en7Dias: () => GeneradorFechas.fecha(7),
    en15Dias: () => GeneradorFechas.fecha(15),
    en30Dias: () => GeneradorFechas.fecha(30),
    en90Dias: () => GeneradorFechas.fecha(90)
  }
};

// ================= GENERADOR DE PRODUCTOS =================
const GeneradorProductos = {
  // Generar productos aleatorios completos
  generar: (cantidad = 3, tipo = 'general') => {
    const productos = [];

    for (let i = 1; i <= cantidad; i++) {
      const valorUnitario = Utilidades.randomValue(10, 500);
      const cantidadProd = Utilidades.randomNumber(1, 50);
      const valorTotal = (parseFloat(valorUnitario) * cantidadProd).toFixed(2);
      const pesoNeto = (Math.random() * 100 + 1).toFixed(2);
      const volumenNeto = (Math.random() * 10 + 0.1).toFixed(3);
      const qtyBox = Utilidades.randomNumber(1, 10);

      const producto = {
        // Información básica
        descripcion: `Producto QA ${i} - Lote ${Utilidades.randomNumber()}`,
        posicion: 10 * i,
        sku: `SKU-${tipo.toUpperCase()}-${Utilidades.randomNumber()}`,
        cantidad: cantidadProd,
        unidad: Utilidades.randomFromArray(DatosMaestros.UNIDADES),
        
        // Empaque y embalaje
        qtyBox: qtyBox,
        paquete: Utilidades.randomFromArray(DatosMaestros.PAQUETES),
        pesoNeto: pesoNeto,
        volumenNeto: volumenNeto,
        
        // Valores financieros
        valorUnitario: valorUnitario,
        valorTotal: valorTotal,
        valorUnitSolic: (parseFloat(valorUnitario) * 0.9).toFixed(2),
        moneda: Utilidades.randomFromArray(DatosMaestros.MONEDAS),
        tasaCambio: '1.000',
        impuestos: (parseFloat(valorTotal) * CONFIG.IVA).toFixed(2),
        descuento: (parseFloat(valorTotal) * CONFIG.DESCUENTO_BASE).toFixed(2),
        
        // Información de producto
        marca: Utilidades.randomFromArray(DatosMaestros.MARCAS),
        categoria: Utilidades.randomFromArray(DatosMaestros.CATEGORIAS),
        criticidad: Utilidades.randomFromArray(DatosMaestros.CRITICIDADES),
        
        // Logística
        centro: Utilidades.randomFromArray(DatosMaestros.CENTROS),
        almacen: Utilidades.randomFromArray(DatosMaestros.ALMACENES),
        ubicacion: `UBIC-${Utilidades.randomNumber(1, 100)}`,
        
        // Trazabilidad
        lote: `LOTE-${Utilidades.randomNumber()}`,
        codigoBarras: `CB${Utilidades.randomNumber()}${Utilidades.randomNumber()}`,
        fechaVencimiento: GeneradorFechas.fecha(365),
        
        // Proveedor
        proveedor: Utilidades.randomFromArray(DatosMaestros.PROVEEDORES),
        
        // Observaciones
        observacion: `Observacion producto ${i}: Manejar con cuidado. Fecha gen: ${GeneradorFechas.fechaCompleta(0)}`,
        
        // Fechas de planificación
        tProduccionPlanificada: GeneradorFechas.fecha(3),
        etdRequested: GeneradorFechas.fecha(5),
        etaRequested: GeneradorFechas.fecha(10),
        warehouseRequestDate: GeneradorFechas.fecha(4)
      };

      productos.push(producto);
    }
    
    return productos;
  },

  // Generar productos específicos para importación
  generarImportacion: (cantidad = 3) => {
    return GeneradorProductos.generar(cantidad, 'importacion');
  },

  // Generar productos específicos para exportación
  generarExportacion: (cantidad = 2) => {
    return GeneradorProductos.generar(cantidad, 'exportacion');
  }
};

// ================= GENERADOR DE DATOS DE CONTACTO =================
const GeneradorContacto = {
  // Generar información de contacto completa
  generar: () => {
    const nombre = `Contacto ${Utilidades.randomFromArray(DatosMaestros.USUARIOS)}`;
    
    return {
      nombre: nombre,
      email: Utilidades.randomEmail(),
      telefono: Utilidades.randomPhone(),
      direccion: `Calle ${Utilidades.randomNumber(1, 200)} #${Utilidades.randomNumber(1, 100)}-${Utilidades.randomNumber(1, 50)}`,
      ciudad: CONFIG.CIUDAD_BASE,
      pais: CONFIG.PAIS_BASE,
      departamento: 'Comercial',
      cargo: 'Ejecutivo Comercial'
    };
  }
};

// ================= GENERADOR DE DATOS DE ENVÍO =================
const GeneradorEnvio = {
  // Generar configuración de envío completa
  generar: (tipoEnvio = null) => {
    const tipo = tipoEnvio || Utilidades.randomFromArray(DatosMaestros.FORMAS_ENVIO);
    const pesoTotal = (Math.random() * 1000 + 100).toFixed(2);
    const volumenTotal = (Math.random() * 50 + 5).toFixed(2);
    
    return {
      tipo: tipo,
      pesoTotal: pesoTotal,
      volumenTotal: volumenTotal,
      cantidadBultos: Utilidades.randomNumber(1, 20),
      seguro: Utilidades.randomBoolean(),
      valorSeguro: Utilidades.randomBoolean() ? Utilidades.randomValue(100, 1000) : '0.00',
      transporte: `Transportadora ${Utilidades.randomFromArray(['A', 'B', 'C', 'Express'])}`,
      guia: `GUIA-${Utilidades.randomNumber(10000, 99999)}`,
      condiciones: 'Manejar con cuidado, producto fragil'
    };
  }
};

// ================= GENERADOR DE DATOS FINANCIEROS =================
const GeneradorFinanciero = {
  // Generar datos de pago
  generarPago: () => {
    return {
      metodo: Utilidades.randomFromArray(DatosMaestros.METODOS_PAGO),
      terminos: Utilidades.randomFromArray(DatosMaestros.TERMINOS_PAGO),
      moneda: CONFIG.MONEDA_BASE,
      tasaCambio: '1.000',
      cuentaBancaria: `CTA-${Utilidades.randomNumber(100000, 999999)}`,
      banco: Utilidades.randomFromArray(['Banco Chile', 'Santander', 'BCI', 'Itau'])
    };
  },

  // Generar datos de contrato
  generarContrato: () => {
    return `CONT-${Utilidades.randomNumber(1000, 9999)}-${new Date().getFullYear()}`;
  }
};

// ================= GENERADOR DE DESCRIPCIONES =================
const GeneradorDescripciones = {
  // Generar descripciones realistas
  descripcionesOrden: [
    "Descripcion detallada del pedido de exportacion",
    "Especificaciones completas del producto solicitado",
    "Detalles tecnicos y requerimientos de calidad",
    "Informacion completa de la orden de venta",
    "Pedido con especificaciones tecnicas especiales",
    "Orden con requerimientos de empaque especifico",
    "Productos con certificaciones de calidad internacional",
    "Pedido sujeto a inspeccion previa al embarque"
  ],

  // Generar observaciones
  observaciones: [
    "Manejar con cuidado, producto fragil",
    "Almacenar en lugar seco y fresco",
    "No exponer a la luz solar directa",
    "Mantener en posicion vertical",
    "Producto sensible a cambios de temperatura",
    "Requiere manipulacion especial",
    "Sujeto a control de calidad estricto"
  ],

  // Obtener descripción aleatoria
  obtenerDescripcion: () => Utilidades.randomFromArray(GeneradorDescripciones.descripcionesOrden),

  // Obtener observación aleatoria
  obtenerObservacion: () => Utilidades.randomFromArray(GeneradorDescripciones.observaciones)
};

// ================= GENERADOR PRINCIPAL =================
export function generarDatos(base) {
  // Crear copia profunda del base
  const json = JSON.parse(JSON.stringify(base));

  // Procesar cada sección (importacion, exportacion)
  Object.keys(json).forEach((key) => {
    const section = json[key];
    const esExportacion = key === 'exportacion';
    const esImportacion = key === 'importacion';
    
    // ========== CAMPOS BÁSICOS REQUERIDOS ==========
    
    // Número de orden
    if (section.number) {
      if (esExportacion) {
        section.number = `OV-${Utilidades.randomBoolean() ? "IMP" : "EXP"}-${Utilidades.randomNumber()}`;
      } else {
        section.number = `OC-${Utilidades.randomBoolean() ? "IMP" : "EXP"}-${Utilidades.randomNumber()}`;
      }
    }
    
    // Valor total
    if (section.totalValue) {
      section.totalValue = Utilidades.randomValue();
    }
    
    // Usuario
    if (section.usuario || section.user) {
      const usuario = Utilidades.randomFromArray(DatosMaestros.USUARIOS);
      section.usuario = usuario;
      section.user = usuario;
    }
    
    // ========== CAMPOS DE FECHA ==========
    
    // Fechas principales
    const fechas = {
      date: GeneradorFechas.rangoFechas.hoy(),
      confirmationDate: GeneradorFechas.rangoFechas.manana(),
      deliveryDate: GeneradorFechas.rangoFechas.en5Dias(),
      etdRequested: GeneradorFechas.rangoFechas.en3Dias(),
      etaRequested: GeneradorFechas.rangoFechas.en7Dias(),
      warehouseRequestDate: GeneradorFechas.rangoFechas.en3Dias(),
      tProduccionPlanificada: GeneradorFechas.rangoFechas.en3Dias()
    };
    
    Object.keys(fechas).forEach(fechaKey => {
      if (section[fechaKey] !== undefined) {
        section[fechaKey] = fechas[fechaKey];
      }
    });
    
    // ========== CAMPOS ADICIONALES ==========
    
    // Orden fraccionada
    if (typeof section.fractionada === 'undefined') {
      section.fractionada = Utilidades.randomBoolean();
    }
    
    // Empresa
    if (!section.company) {
      section.company = Utilidades.randomFromArray(DatosMaestros.EMPRESAS);
    }
    
    // Incoterm
    if (!section.incoterm) {
      section.incoterm = Utilidades.randomFromArray(DatosMaestros.INCOTERMS);
    }
    
    // Forma de envío
    if (!section.shippingWay) {
      section.shippingWay = Utilidades.randomFromArray(DatosMaestros.FORMAS_ENVIO);
    }
    
    // Método de pago
    if (!section.paymentMethod) {
      section.paymentMethod = Utilidades.randomFromArray(DatosMaestros.METODOS_PAGO);
    }
    
    // Puertos
    if (!section.portOrigin) {
      section.portOrigin = Utilidades.randomFromArray(DatosMaestros.PUERTOS);
    }
    
    if (!section.portDestination) {
      section.portDestination = Utilidades.randomFromArray(DatosMaestros.PUERTOS);
    }
    
    // Productor
    if (!section.productor) {
      section.productor = Utilidades.randomFromArray(DatosMaestros.PRODUCTORES);
    }
    
    // Proveedor
    if (!section.proveedor) {
      section.proveedor = Utilidades.randomFromArray(DatosMaestros.PROVEEDORES);
    }
    
    // ========== CAMPOS ESPECÍFICOS POR TIPO ==========
    
    // Contrato (específico para exportación)
    if (!section.contractNumber && esExportacion) {
      section.contractNumber = GeneradorFinanciero.generarContrato();
    }
    
    // Detalle de orden
    if (!section.orderDetail && esExportacion) {
      section.orderDetail = GeneradorDescripciones.obtenerDescripcion();
    }
    
    // Cliente (específico para importación)
    if (!section.cliente && esImportacion) {
      section.cliente = Utilidades.randomFromArray(DatosMaestros.CLIENTES);
    }
    
    // Comprador (específico para exportación)
    if (!section.comprador && esExportacion) {
      section.comprador = Utilidades.randomFromArray(DatosMaestros.COMPRADORES);
    }
    
    // ========== INFORMACIÓN ADICIONAL ==========
    
    // Números de pedido y orden
    if (!section.orderClientNumber) {
      section.orderClientNumber = `PED-${Utilidades.randomNumber(100, 999)}`;
    }
    
    if (!section.purchaseOrderNumber) {
      section.purchaseOrderNumber = `PO-${Utilidades.randomNumber(1000, 9999)}`;
    }
    
    // Descripciones
    if (!section.orderDescription) {
      section.orderDescription = `Descripcion completa del pedido para testing automatizado. Orden generada el ${GeneradorFechas.fechaCompleta(0)}. Incluye manejo de fechas y calendarios.`;
    }
    
    // Cliente interno
    if (!section.internalClient) {
      section.internalClient = `Cliente Interno QA-${Utilidades.randomNumber()}`;
    }
    
    // Información de contacto
    const contacto = GeneradorContacto.generar();
    if (!section.contactName) section.contactName = contacto.nombre;
    if (!section.contactEmail) section.contactEmail = contacto.email;
    if (!section.contactPhone) section.contactPhone = contacto.telefono;
    
    // Observaciones e instrucciones
    if (!section.observaciones) {
      section.observaciones = `Observaciones de prueba para la orden ${section.number}. Generado automaticamente por sistema QA. Fechas configuradas correctamente.`;
    }
    
    if (!section.specialInstructions) {
      section.specialInstructions = `${GeneradorDescripciones.obtenerObservacion()}. Orden ${section.number}. Todas las fechas validadas.`;
    }
  });

  // ========== ESTRUCTURAS COMPLETAS POR TIPO ==========
  
  if (json.importacion) {
    json.importacion = {
      ...json.importacion,
      productos: GeneradorProductos.generarImportacion(3),
      contacto: GeneradorContacto.generar(),
      envio: GeneradorEnvio.generar(json.importacion.shippingWay),
      pago: GeneradorFinanciero.generarPago(),
      metadata: {
        generadoEl: GeneradorFechas.fechaHora(),
        version: CONFIG.VERSION,
        tipo: 'orden_compra',
        caracteristicas: ['fechas_manejadas', 'calendarios', 'todos_los_campos', 'productos_completos']
      }
    };
  }

  if (json.exportacion) {
    json.exportacion = {
      ...json.exportacion,
      productos: GeneradorProductos.generarExportacion(2),
      contacto: GeneradorContacto.generar(),
      envio: GeneradorEnvio.generar(json.exportacion.shippingWay),
      pago: GeneradorFinanciero.generarPago(),
      metadata: {
        generadoEl: GeneradorFechas.fechaHora(),
        version: CONFIG.VERSION,
        tipo: 'orden_venta',
        campos_especificos: ['contractNumber', 'orderDetail', 'comprador', 'productor']
      }
    };
  }

  // ========== LOGS INFORMATIVOS ==========
  
  console.log('=== DATOS GENERADOS EXITOSAMENTE ===');
  console.log('Proyecto:', CONFIG.PROYECTO);
  console.log('Version generador:', CONFIG.VERSION);
  
  if (json.importacion) {
    console.log('Orden compra:', json.importacion.number);
    console.log('Empresa:', json.importacion.company);
    console.log('Productos generados:', json.importacion.productos.length);
  }
  
  if (json.exportacion) {
    console.log('Orden venta:', json.exportacion.number);
    console.log('Comprador:', json.exportacion.comprador);
    console.log('Productos generados:', json.exportacion.productos.length);
  }
  
  console.log('Timestamp:', GeneradorFechas.fechaHora());
  console.log('=====================================');

  return json;
}

// ================= FUNCIONES DE EXPORTACIÓN =================

export function generarDatosPrueba(tipo = 'importacion') {
  const base = {
    importacion: {
      number: '',
      totalValue: '',
      company: '',
      incoterm: '',
      fractionada: false,
      user: '',
      date: '',
      confirmationDate: '',
      deliveryDate: '',
      etdRequested: '',
      etaRequested: '',
      warehouseRequestDate: '',
      tProduccionPlanificada: '',
      cliente: '',
      orderClientNumber: '',
      purchaseOrderNumber: '',
      orderDetail: '',
      orderDescription: '',
      internalClient: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      observaciones: '',
      specialInstructions: ''
    },
    exportacion: {
      number: '',
      totalValue: '',
      company: '',
      incoterm: '',
      fractionada: false,
      user: '',
      date: '',
      confirmationDate: '',
      deliveryDate: '',
      etdRequested: '',
      etaRequested: '',
      warehouseRequestDate: '',
      tProduccionPlanificada: '',
      comprador: '',
      orderClientNumber: '',
      purchaseOrderNumber: '',
      orderDetail: '',
      orderDescription: '',
      internalClient: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      observaciones: '',
      specialInstructions: '',
      contractNumber: '',
      shippingWay: '',
      paymentMethod: '',
      portOrigin: '',
      portDestination: '',
      productor: '',
      proveedor: ''
    }
  };

  return generarDatos(base);
}

export function generarDatosOrdenVenta() {
  const baseData = {
    exportacion: {
      number: '',
      totalValue: '',
      company: '',
      incoterm: '',
      fractionada: false,
      user: '',
      date: '',
      confirmationDate: '',
      deliveryDate: '',
      etdRequested: '',
      etaRequested: '',
      warehouseRequestDate: '',
      tProduccionPlanificada: '',
      comprador: '',
      orderClientNumber: '',
      contractNumber: '',
      orderDetail: '',
      orderDescription: '',
      internalClient: '',
      shippingWay: '',
      paymentMethod: '',
      portOrigin: '',
      portDestination: '',
      productor: '',
      proveedor: ''
    }
  };

  return generarDatos(baseData);
}

export function generarDatosOrdenCompra() {
  const baseData = {
    importacion: {
      number: '',
      totalValue: '',
      company: '',
      incoterm: '',
      fractionada: false,
      user: '',
      date: '',
      confirmationDate: '',
      deliveryDate: '',
      etdRequested: '',
      etaRequested: '',
      warehouseRequestDate: '',
      tProduccionPlanificada: '',
      cliente: '',
      orderClientNumber: '',
      purchaseOrderNumber: '',
      orderDetail: '',
      orderDescription: '',
      internalClient: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      observaciones: '',
      specialInstructions: ''
    }
  };

  return generarDatos(baseData);
}

// ================= EXPORTACIÓN DE MÓDULOS INTERNOS (para testing) =================

export const ModulosInternos = {
  Utilidades,
  DatosMaestros,
  GeneradorFechas,
  GeneradorProductos,
  GeneradorContacto,
  GeneradorEnvio,
  GeneradorFinanciero,
  GeneradorDescripciones,
  CONFIG
};