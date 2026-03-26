// =============================================
// GOOGLE SHEETS – KONFIGURACE
// Po nasazení Apps Scriptu vlož sem URL web appu
// =============================================

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxf1k2pqDKIFO5e8WAcyIPgsrVw4WMx3-aNx8t27MKLLmDZ4bnh7hko5b9MBYqPkMz6qg/exec';

// Odeslání leadu do Google Sheets přes Apps Script
async function saveLead(data) {
  if (!SHEETS_URL || SHEETS_URL === 'DOPLNIT_APPS_SCRIPT_URL') {
    console.warn('sheets.js: SHEETS_URL není nastaven.');
    return false;
  }
  try {
    // Apps Script vyžaduje no-cors kvůli přesměrování – odpověď je opaque, ale data se uloží
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data)
    });
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

const SPREADSHEET_ID = '1TP-wwoirV4mfYfmr2v2P5-2nIHo0SYaTPQ5ChtOpq5Q';
const NOTIFY_EMAIL   = 'matyas.vrbaa@gmail.com'; // ← po otestování změnit na Jakubův mail

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.zdroj === 'kalkulace-sekce') {
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
      const tab = getOrCreateSheet(sheet, 'leads', [
        'Datum', 'Jméno', 'Email', 'Telefon', 'Typ', 'SPZ', 'Zpráva', 'Data'
      ]);
      tab.appendRow([
        new Date(),
        data.jmeno || '',
        data.email || '',
        data.telefon || '',
        data.typ || '',
        data.spz || '',
        data.zprava || '',
        JSON.stringify(data)
      ]);
    }

    // === EMAIL NOTIFIKACE ===
    sendNotification(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotification(data) {
  const typ = data.typ || data.zdroj || 'neznámý';
  const jmeno = data.jmeno || '–';
  const telefon = data.telefon || '–';
  const email = data.email || '–';
  const spz = data.spz ? '\nSPZ: ' + data.spz : '';
  const zprava = data.zprava ? '\nZpráva: ' + data.zprava : '';

  const subject = '🔔 Nová poptávka z webu – ' + jmeno;
  const body =
    'Nová poptávka z jakubsojka.cz\n' +
    '─────────────────────────────\n' +
    'Typ: ' + typ + '\n' +
    'Jméno: ' + jmeno + '\n' +
    'Telefon: ' + telefon + '\n' +
    'Email: ' + email +
    spz +
    zprava + '\n' +
    '─────────────────────────────\n' +
    'Datum: ' + new Date().toLocaleString('cs-CZ') + '\n\n' +
    'Zobrazit v Google Sheets:\n' +
    'https://docs.google.com/spreadsheets/d/1TP-wwoirV4mfYfmr2v2P5-2nIHo0SYaTPQ5ChtOpq5Q/edit';

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
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

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'reviews') {
    return getGoogleReviews();
  }
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Jakub Sojka – Sheets API běží' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Google Places proxy – API klíč ulož do Script Properties jako GOOGLE_API_KEY
// (v Apps Scriptu: Project Settings → Script Properties → Add property)
function getGoogleReviews() {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GOOGLE_API_KEY');
    const placeId = 'ChIJ8ZI1Bz0afUQROOfmcp43wHM=';
    const url = 'https://maps.googleapis.com/maps/api/place/details/json'
      + '?place_id=' + encodeURIComponent(placeId)
      + '&fields=reviews,rating,user_ratings_total'
      + '&language=cs'
      + '&key=' + apiKey;
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
*/
