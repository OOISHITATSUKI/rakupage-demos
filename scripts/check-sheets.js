const { google } = require('googleapis');
const path = require('path');

const SPREADSHEET_ID = '1YvF6UdXDDoGsJtk4BgVb3rs7zV0IU7coJE_l7fQQTBY';
const KEY_FILE = path.join(__dirname, '../.company/credentials/service-account.json');

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Get all sheet names
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheetNames = meta.data.sheets.map(s => s.properties.title);
  console.log('=== シート一覧 ===');
  sheetNames.forEach(name => console.log(`  - ${name}`));

  // Get first few rows of each sheet
  for (const name of sheetNames) {
    console.log(`\n=== ${name} ===`);
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${name}'!A1:Z5`
      });
      const rows = res.data.values || [];
      rows.forEach((row, i) => console.log(`  Row ${i + 1}: ${row.join(' | ')}`));
      if (rows.length === 0) console.log('  (空)');
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }
}

main().catch(console.error);
