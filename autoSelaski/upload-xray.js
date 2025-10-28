/**
 * upload-xray.js
 * Subir JUnit (Cypress) a Xray Cloud y opcionalmente adjuntar archivo a la TestExecution en Jira.
 * Autor: Viviana QA (mejorado)
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const glob = require('glob');
require('dotenv').config();
const { parseStringPromise } = require('xml2js'); // Para parsear XML

// --- CONFIG
const XRAY_CLIENT_ID = process.env.XRAY_CLIENT_ID;
const XRAY_CLIENT_SECRET = process.env.XRAY_CLIENT_SECRET;
const PROJECT_KEY = process.env.PROJECT_KEY || 'QA';
const REPORT_GLOB = process.env.REPORT_GLOB || 'cypress/reports/junit/**/*.xml';
const XRAY_TESTEXEC_KEY = process.env.XRAY_TESTEXEC_KEY; 
const JIRA_BASE_URL = process.env.JIRA_BASE_URL; 
const ATLAS_USER = process.env.ATLAS_USER;
const ATLAS_API_TOKEN = process.env.ATLAS_API_TOKEN;
const ATTACH_FILE = process.env.ATTACH_FILE;

if (!XRAY_CLIENT_ID || !XRAY_CLIENT_SECRET) {
  console.error('❌ Falta XRAY_CLIENT_ID o XRAY_CLIENT_SECRET en variables de entorno.');
  process.exit(1);
}

async function getXrayToken() {
  const url = 'https://xray.cloud.getxray.app/api/v2/authenticate';
  const resp = await axios.post(url, {
    client_id: XRAY_CLIENT_ID,
    client_secret: XRAY_CLIENT_SECRET
  }, { headers: { 'Content-Type': 'application/json' } });

  if (typeof resp.data === 'string') return resp.data.replace(/"/g, '');
  if (resp.data && (resp.data.token || resp.data.access_token)) return resp.data.token || resp.data.access_token;
  throw new Error('Respuesta inesperada de autenticación Xray: ' + JSON.stringify(resp.data));
}

function findValidReportFiles() {
  const files = glob.sync(REPORT_GLOB);
  const validFiles = files.filter(f => {
    const content = fs.readFileSync(f, 'utf8');
    return /<testcase/.test(content); 
  });

  if (validFiles.length === 0) {
    console.error('❌ No hay archivos JUnit válidos con <testcase>');
    process.exit(1);
  }

  console.log('📄 Archivos JUnit válidos encontrados:', validFiles);
  return validFiles;
}

// --- Función para mostrar resumen de tests (retorna conteo)
async function showTestSummary(file) {
  const content = fs.readFileSync(file, 'utf8');
  const xml = await parseStringPromise(content);
  let total = 0, failed = 0;

  const testcases = [];
  if (xml.testsuites && xml.testsuites.testsuite) {
    xml.testsuites.testsuite.forEach(ts => {
      if (ts.testcase) testcases.push(...ts.testcase);
    });
  }

  testcases.forEach(tc => {
    total++;
    if (tc.failure) failed++;
  });

  console.log(`📊 Resumen ${file}: Total=${total}, Fallidos=${failed}, Exitosos=${total - failed}`);
  return { total, failed };
}

async function uploadJUnitFile(token, file) {
  const xmlContent = fs.readFileSync(file, 'utf8').replace(/\\/g, '/');
  const query = XRAY_TESTEXEC_KEY ? `?testExecKey=${XRAY_TESTEXEC_KEY}` : `?projectKey=${PROJECT_KEY}`;
  const url = `https://xray.cloud.getxray.app/api/v2/import/execution/junit${query}`;

  try {
    const resp = await axios.post(url, xmlContent, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/xml' },
      maxBodyLength: Infinity
    });
    console.log(`✅ Subido: ${file}`, resp.data);
    return resp.data;
  } catch (err) {
    console.error(`❌ Error subiendo ${file}:`, err.response?.data || err.message);
    return null;
  }
}

function extractTestExecKey(xrayResponse) {
  if (!xrayResponse) return null;
  if (xrayResponse.testExecIssue?.key) return xrayResponse.testExecIssue.key;
  if (xrayResponse.testExecKey) return xrayResponse.testExecKey;
  if (xrayResponse.key) return xrayResponse.key;
  if (Array.isArray(xrayResponse)) {
    const item = xrayResponse.find(it => it.testExecKey || it.testExecIssue?.key);
    if (item) return item.testExecKey || item.testExecIssue?.key;
  }
  return null;
}

async function attachFileToJira(issueKey, filePath) {
  if (!JIRA_BASE_URL || !ATLAS_USER || !ATLAS_API_TOKEN) return null;
  if (!fs.existsSync(filePath)) return null;

  const FormData = require('form-data');
  const form = new FormData();
  form.append('file', fs.createReadStream(path.resolve(filePath)));

  const url = `${JIRA_BASE_URL.replace(/\/$/, '')}/rest/api/3/issue/${issueKey}/attachments`;
  const headers = {
    'X-Atlassian-Token': 'no-check',
    Authorization: `Basic ${Buffer.from(`${ATLAS_USER}:${ATLAS_API_TOKEN}`).toString('base64')}`,
    ...form.getHeaders()
  };

  const resp = await axios.post(url, form, { headers, maxBodyLength: Infinity });
  return resp.data;
}

(async () => {
  try {
    const token = await getXrayToken();
    const files = findValidReportFiles();

    let lastResponse = null;
    let totalFailed = 0;
    for (const file of files) {
      const summary = await showTestSummary(file);
      totalFailed += summary.failed || 0;
      lastResponse = await uploadJUnitFile(token, file);
    }

    const execKey = extractTestExecKey(lastResponse);
    if (execKey) console.log('🎯 Test Execution creado/actualizado:', execKey);

    if (ATTACH_FILE && execKey && totalFailed > 0) {
      const attachResp = await attachFileToJira(execKey, ATTACH_FILE);
      console.log('✅ Respuesta adjunto Jira:', JSON.stringify(attachResp, null, 2));
    }
    if (ATTACH_FILE && execKey && totalFailed === 0) {
      console.log('ℹ️ No se adjunta evidencia porque no hubo casos fallidos.');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error en el proceso:', err.response?.data || err.message || err);
    process.exit(1);
  }
})();
