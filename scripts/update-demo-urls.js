const { google } = require('googleapis');
const path = require('path');

const SPREADSHEET_ID = '1YvF6UdXDDoGsJtk4BgVb3rs7zV0IU7coJE_l7fQQTBY';
const KEY_FILE = path.join(__dirname, '../.company/credentials/service-account.json');
const BASE_URL = 'https://ooishitatsuki.github.io/rakupage-demos';

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // デモURL一覧（No順: 1〜10）
  const demoUrls = [
    [`${BASE_URL}/demo-kanegen-yoshida.html`],
    [`${BASE_URL}/demo-kosaka-koumuten.html`],
    [`${BASE_URL}/demo-watanabe-koumuten.html`],
    [`${BASE_URL}/demo-yamaguchi-gyoumuten.html`],
    [`${BASE_URL}/demo-hokuto-kogei.html`],
    [`${BASE_URL}/demo-adsign.html`],
    [`${BASE_URL}/demo-osaka-hyougu.html`],
    [`${BASE_URL}/demo-ibaraki-kawara.html`],
    [`${BASE_URL}/demo-nagano-kawara.html`],
    [`${BASE_URL}/demo-torimoto.html`]
  ];

  // rakupageシートのO列（デモHP URL列=15列目）にURL書き込み（Row 2〜11）
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: "'rakupage'!O2:O11",
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: demoUrls }
  });

  console.log('rakupageシートにデモURL 10件を書き込みました');

  // 確認
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "'rakupage'!D2:O11"
  });
  const rows = res.data.values || [];
  rows.forEach((row, i) => {
    console.log(`  ${i+1}. ${row[0]} → ${row[row.length-1]}`);
  });
}

main().catch(console.error);
