const { defineConfig } = require('cypress');

const {

  configureAllureAdapterPlugins,
}= require('@mmisty/cypress-allure-adapter/plugins');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://selaski.com',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.{cy,spec}.js',
    defaultCommandTimeout: 10000,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',

    // Resolución de pantalla por defecto
    viewportWidth: 1366,
    viewportHeight: 768,

    setupNodeEvents(on, config) {
      // Integración con Allure Reports
      configureAllureAdapterPlugins(on, config);
      return config;
    },

    env: {
      allure: true, // activa Allure
      allureResultsPath: 'reports/allure-results' // Ruta relativa a la raíz del proyecto
    }
  }
});
