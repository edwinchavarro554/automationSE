const { defineConfig } = require("cypress");
const { configureAllureAdapterPlugins } = require("@mmisty/cypress-allure-adapter/plugins");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://selaski.com", // tu sitio real
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    defaultCommandTimeout: 10000,
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    video: true,

    setupNodeEvents(on, config) {
      // Allure adapter (mmisty)
      configureAllureAdapterPlugins(on, config);

      // Log al finalizar ejecución
      on("after:run", (results) => {
        console.log(
          "✅ Ejecución Cypress completada, resultados listos para enviar a Xray manualmente."
        );
      });

      return config;
    },

    // Reporter múltiple: JUnit + Mochawesome
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      reporterEnabled: "mocha-junit-reporter, mochawesome",
      mochaJunitReporterReporterOptions: {
        mochaFile: "cypress/reports/junit/results-[hash].xml",
        toConsole: false
      },
      mochawesomeReporterOptions: {
        reportDir: "cypress/reports/mochawesome",
        overwrite: false,
        html: true,
        json: true
      }
    },

    env: {
      allure: true,
      allureResultsPath: "cypress/reports/allure-results",
      XRAY_CLIENT_ID: process.env.XRAY_CLIENT_ID,
      XRAY_CLIENT_SECRET: process.env.XRAY_CLIENT_SECRET,
      XRAY_CLOUD: true,
      JIRA_BASE_URL: "https://selaski.atlassian.net",
      PROJECT_KEY: "SE", // ajusta tu clave de proyecto
      uploadResults: true
    }
  }
});
