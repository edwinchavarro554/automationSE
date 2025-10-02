# Selaski QA Automation

Automatización de pruebas E2E para Selaski usando Cypress, Page Object Model (POM) y Allure Reports.

---

## Requisitos Previos

- **Node.js** (v16 o superior): [Descargar Node.js](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Java JDK** (v8 o superior, necesario para Allure): [Descargar Temurin JDK](https://adoptium.net/)
- **Allure Commandline** (opcional, si quieres usarlo globalmente):  
  ```sh
  npm install -g allure-commandline
  ```

---

## Instalación del Proyecto

1. **Clona el repositorio:**
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd autoSelaski
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   ```

---

## Estructura del Proyecto

- `cypress/`  
  - `e2e/` - Pruebas E2E
  - `fixtures/` - Datos de prueba (JSON)
  - `pages/` - Page Objects
  - `support/` - Comandos y hooks globales
- `reports/` - Carpeta para resultados de Allure
- `allure-report/` - Carpeta generada con el reporte HTML de Allure

---

## Ejecución de Pruebas

### 1. Limpiar reportes anteriores (opcional)
```sh
npm run allure:clean
```

### 2. Ejecutar pruebas en modo headless
```sh
npm run cypress:run
```

### 3. Generar el reporte Allure
```sh
npm run allure:generate
```

### 4. Abrir el reporte Allure en el navegador
```sh
npm run allure:open
```

> **Nota:**  
> No abras el archivo `index.html` directamente, usa siempre el comando anterior para abrir el reporte.

---

## Scripts Disponibles

- `npm run cypress:open` — Abre el Test Runner de Cypress (modo interactivo)
- `npm run cypress:run` — Ejecuta todas las pruebas en modo headless
- `npm run allure:generate` — Genera el reporte Allure en `allure-report`
- `npm run allure:open` — Abre el reporte Allure en el navegador
- `npm run allure:clean` — Elimina la carpeta `allure-report`
- `npm test` — Ejecuta pruebas y genera el reporte Allure

---

## Consideraciones

- **No abras el reporte Allure directamente desde el archivo HTML.**  
  Siempre usa el comando `npm run allure:open`.
- **JAVA_HOME** debe estar configurado y apuntar a la carpeta de instalación del JDK.
- Si usas Windows y ves errores con el comando `cp`, ignóralos o usa el comando alternativo con `xcopy` para historial.
- Los resultados de Allure se generan por defecto en la carpeta `allure-results` o la que esté configurada en tu `cypress.config.js`.

---

## Solución de Problemas

- Si el reporte Allure aparece vacío o en "Cargando...", asegúrate de:
  - Haber ejecutado las pruebas antes de generar el reporte.
  - Usar el comando correcto para abrir el reporte.
  - No tener archivos corruptos en `allure-results`.
  - No mezclar adaptadores de Allure (usa solo uno: mmisty o shelex).

- Si `allure` no es reconocido, usa `npx allure ...` o instala Allure globalmente.

---

## Créditos

Autor: Edwin Chavarro Trujillo

---
