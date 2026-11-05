/**
 * DataSense AI Accelerator — intake receiver.
 * Appends every form submission as a row in the bound Google Sheet.
 * Deploy: Extensions → Apps Script → paste this → Deploy → New deployment →
 *         type "Web app", Execute as "Me", Who has access "Anyone".
 */
const SHEET_NAME = 'Responses';
// Spreadsheet that receives responses (from its URL: /spreadsheets/d/<ID>/edit).
// Leave '' if this script is bound to the sheet (Extensions → Apps Script).
const SPREADSHEET_ID = '1awHqUERVjm7n3DV8IPfwSD9NCet8aRwTHE-iV5Wmzow';

const COLUMNS = [
  ['submittedAt', 'Submitted at'],
  ['name', 'Name'],
  ['email', 'Email'],
  ['whatsapp', 'WhatsApp'],
  ['linkedin', 'LinkedIn'],
  ['stage', 'Current stage'],
  ['experience', 'Experience'],
  ['target', 'Target role'],
  ['timeline', 'Timeline'],
  ['hours', 'Hours / week'],
  ['slot', 'Preferred time'],
  ['timezone', 'Timezone'],
  ['coding', 'Coding comfort (1-5)'],
  ['tools', 'Tools used'],
  ['learning', 'Learning style'],
  ['workstyle', 'Work style'],
  ['stuck', 'Stuck on'],
  ['strengths', 'Strengths'],
  ['weakness', 'Biggest weakness'],
  ['success', 'Success in 3 months'],
  ['availability', 'Call availability (PST)'],
  ['archetype', 'Archetype'],
  ['note', 'Notes for the call'],
  // added in v2 (kept at the end so earlier rows stay aligned)
  ['title', 'Current title / study'],
  ['company', 'Company / college'],
  ['domain', 'Industry'],
  ['workfocus', 'Day-to-day work'],
  ['projects', 'Built so far'],
  ['enjoy', 'Enjoys'],
  ['stuckhabit', 'When stuck, they…'],
];

function getSheet_() {
  const ss = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  // keep header row in sync with COLUMNS (safe because new columns are only appended)
  const header = sheet.getRange(1, 1, 1, COLUMNS.length);
  const want = COLUMNS.map(c => c[1]);
  if (header.getValues()[0].join('|') !== want.join('|')) {
    header.setValues([want]).setFontWeight('bold').setBackground('#111111').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    if (data.website) return json_({ ok: true }); // honeypot: bots fill hidden field
    const row = COLUMNS.map(([key]) => {
      const v = data[key];
      if (Array.isArray(v)) return v.join(key === 'availability' ? '\n' : ', ');
      if (v == null || v === '') return '';
      const str = String(v).slice(0, 2000);
      // store phone numbers / anything starting with = + - @ as plain text (no formulas, no number mangling)
      return /^[=+\-@]/.test(str) || key === 'whatsapp' ? "'" + str : str;
    });
    getSheet_().appendRow(row);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: 'DataSense intake' });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
