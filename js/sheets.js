// =============================================
// GOOGLE SHEETS – KONFIGURACE
// Po nasazení Apps Scriptu vlož sem URL web appu
// =============================================

const SHEETS_URL = 'DOPLNIT_APPS_SCRIPT_URL';

// Odeslání leadu do Google Sheets přes Apps Script
async function saveLead(data) {
  if (!SHEETS_URL || SHEETS_URL === 'DOPLNIT_APPS_SCRIPT_URL') {
    console.warn('sheets.js: SHEETS_URL není nastaven.');
    return false;
  }
  try {
    const response = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // CORS workaround pro Apps Script
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (result.status !== 'ok') {
      console.error('Sheets error:', result);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Network error:', e);
    return false;
  }
}

/*
=== GOOGLE APPS SCRIPT – zkopíruj do script.google.com ===

Vytvoř nový projekt, vlož tento kód a nasaď jako Web App:
  - Execute as: Me (matyas.vrbaa@gmail.com)
  - Who has access: Anyone

const SPREADSHEET_ID = 'DOPLNIT_SPREADSHEET_ID'; // ID Google Sheetu

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Rozlišíme typ záznamu
    if (data.zdroj === 'kalkulace-sekce') {
      // Poptávky z kalkulačky
      const tab = getOrCreateSheet(sheet, 'poptavky', [
        'Datum', 'Jméno', 'Email', 'Telefon', 'Typ', 'Cena od', 'Cena do', 'Zdroj'
      ]);
      tab.appendRow([
        new Date(),
        data.jmeno || '',
        data.email || '',
        data.telefon || '',
        data.typ || '',
        data.cena_od || '',
        data.cena_do || '',
        data.zdroj || ''
      ]);
    } else {
      // Ostatní leads (SPZ, kontaktní formulář, hypotéka)
      const tab = getOrCreateSheet(sheet, 'leads', [
        'Datum', 'Jméno', 'Email', 'Telefon', 'Typ', 'SPZ', 'Zpráva', 'Data kalkulačky'
      ]);
      tab.appendRow([
        new Date(),
        data.jmeno || '',
        data.email || '',
        data.telefon || '',
        data.typ || '',
        data.spz || '',
        data.zprava || '',
        data.kalkulacka_data ? JSON.stringify(data.kalkulacka_data) : ''
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// GET endpoint pro testování
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Jakub Sojka – Sheets API běží' }))
    .setMimeType(ContentService.MimeType.JSON);
}
*/
