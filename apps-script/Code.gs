/**
 * DataSense AI Accelerator — intake receiver.
 * Appends every form submission as a row in the bound Google Sheet.
 * Deploy: Extensions → Apps Script → paste this → Deploy → New deployment →
 *         type "Web app", Execute as "Me", Who has access "Anyone".
 */
const SHEET_NAME = 'Responses';

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
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(c => c[1]));
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#111111').setFontColor('#ffffff');
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
      return v == null ? '' : String(v).slice(0, 2000);
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
