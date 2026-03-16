const { google } = require('googleapis');
const path = require('path');

const SPREADSHEET_ID = '1YvF6UdXDDoGsJtk4BgVb3rs7zV0IU7coJE_l7fQQTBY';
const KEY_FILE = path.join(__dirname, '../.company/credentials/service-account.json');

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // === H事業リサーチデータ ===
  const hData = [
    ['リサーチ日', 'No', '業種', '会社名', 'エリア', '住所', '電話番号', 'HP URL', 'HP問題点', 'スマホ対応', 'Google評価', '口コミ数', '優先度', 'メモ', 'デモHP URL'],
    ['2026-03-16', 1, '工務店', '有限会社 カネゲン吉田工務店', '山形県米沢市', '山形県米沢市春日2丁目2-1', '0238-23-2736', 'http://www.kanegen-y.com/', 'SSL証明書エラー、http運用、デザイン古い、テンプレート感強い', '×', '不明', '不明', 'A', '有限会社で地方の老舗工務店。SSL証明書が無効でブラウザ警告。新築・リフォーム両対応', 'docs/demos/demo-kanegen-yoshida.html'],
    ['2026-03-16', 2, '工務店', '有限会社 小坂工務店', '秋田県北秋田市', '秋田県北秋田市栄字前綱106-7', '0186-62-4167', 'http://www.kosaka-arc.jp/', '自己署名証明書エラー、http運用、デザイン古い、アクセス不安定', '×', '不明', '不明', 'A', '秋田県の地方工務店。自己署名SSL証明書でブラウザ警告。設計〜アフターまで一貫対応', 'docs/demos/demo-kosaka-koumuten.html'],
    ['2026-03-16', 3, '工務店（自然派住宅）', '有限会社 渡辺工務店', '栃木県壬生町', '栃木県下都賀郡壬生町寿町2-9', '0282-82-0408', 'http://www.watanabe-kt.com/', 'SSL証明書エラー、http運用、デザイン古い、スマホ未対応', '×', '不明', '不明', 'A', '自然派住宅・木造建築が売り。HPリニューアルでブランディング強化の余地大', 'docs/demos/demo-watanabe-koumuten.html'],
    ['2026-03-16', 4, '左官・塗装・外構', '有限会社 山口業務店', '愛知県春日井市', '愛知県春日井市六軒屋町4丁目101', '090-3304-1150', 'http://yamaguchigyoumuten.jp/', 'SSL未対応、サイト接続不安定（ECONNREFUSED）、デザイン古い', '×', '不明', '不明', 'A', '創業75年以上の老舗。携帯番号が代表電話。ITリテラシー低い典型。戸建て・マンション対応', ''],
    ['2026-03-16', 5, '看板・サイン', '北斗工芸', '鳥取県米子市', '鳥取県米子市旗ヶ崎2-12-37', '0859-34-2831', 'http://hokutokogei.co.jp/', 'SSL未対応（http://）、デザイン古い、情報量少ない', '×', '不明', '不明', 'B', '地方の看板屋。HTTPのみ。HP自体の重要性を理解していない可能性高く、提案しやすい', ''],
    ['2026-03-16', 6, '看板・サイン', '株式会社アド・サイン', '大分県大分市', '大分県大分市小野鶴1916番地の1', '097-541-7755', 'http://www.adsign-jpn.com/', 'SSL証明書期限切れ、HTTPのまま運用、デザイン古い、ブラウザ警告表示', '×', '不明', '不明', 'A', 'SSL証明書期限切れで危険警告表示。看板のプロなのにHP管理不能。メンテ君加盟店', ''],
    ['2026-03-16', 7, '表具・内装（組合）', '大阪府表具内装協同組合', '大阪府', '大阪府（組合サイト参照）', '組合サイト参照', 'http://osaka-hyougu.or.jp/', 'SSL未対応、テーブルレイアウト、2010年代デザイン、旧版GA使用', '△', '-', '-', 'B', '大阪・兵庫・奈良・滋賀・和歌山カバーの広域組合。組合HP改善→加盟店への横展開が狙える', ''],
    ['2026-03-16', 8, '瓦工事（組合）', '茨城県瓦工事業組合', '茨城県', '茨城県（組合サイト参照）', '組合サイト参照', 'http://www.ibagaren.com/', 'SSL証明書エラー、デザイン古い、加盟店検索CGI使用', '×', '-', '-', 'B', 'SSL証明書無効でブラウザ警告。CGI使用の古い構成。組合HP→加盟店HP二段階営業が可能', ''],
    ['2026-03-16', 9, '瓦工事（組合）', '長野県瓦事業組合', '長野県松本市', '長野県松本市宮渕1-4-39', '0263-32-0800', 'http://naganokengaren.com/', 'SSL証明書エラー、デザイン非常に古い、支部ページあり', '×', '-', '-', 'B', '長野県全域の瓦事業組合。SSL無効でブラウザ警告。加盟店一覧が支部別にあり横展開可能', ''],
    ['2026-03-16', 10, '表具（屏風・掛軸等）', '株式会社鳥本', '岐阜県岐阜市', '岐阜県岐阜市細畑3丁目22番15号', '058-246-9005', 'https://torimoto.jimdofree.com/', 'Jimdo無料版使用、独自ドメインなし、無料テンプレ、バナー広告表示', '○（Jimdoのレスポンシブ）', '不明', '不明', 'B', '創業50年以上の老舗。高い技術力がありながらJimdo無料版で信頼性低い。独自ドメイン移行提案が効果的', '']
  ];

  // === L事業リサーチデータ ===
  const lData = [
    ['リサーチ日', 'カテゴリ', 'No', 'エリア', '院名', '住所', '電話番号', 'HP有無', 'LINE有無', '予約方法', 'Google評価', '口コミ数', '優先度', 'メモ'],
    ['2026-03-16', 'モニター院候補', 1, '荒川区', '真治堂鍼灸接骨院', '荒川区西日暮里5-15-10 木塚ビル1F', '03-3802-6045', 'あり', 'なし', '電話・Instagram DM', '3.5（Yahoo!マップ）', '不明', 'A', 'JR西日暮里駅徒歩2分。Web予約フォーム廃止済み。LINE未導入でAI受付提案の好機。月水木金12:00-22:00と夜間対応'],
    ['2026-03-16', 'モニター院候補', 2, '台東区', '星名接骨院', '台東区上野3-18-2', '03-3831-0494', 'あり（簡易）', 'なし', '電話', '不明', '不明', 'A', '御徒町駅徒歩3分。老舗で独自の「星名式健体法」を提供。LINE・Web予約なし。電話対応の負担軽減を提案しやすい'],
    ['2026-03-16', 'モニター院候補', 3, '台東区', 'つくし鍼灸整骨院', '台東区北上野2-28-2 プリムラハセビル1F', '03-6881-6210', 'あり', '不明', '電話・EPARK', '不明', '不明', 'A', '入谷駅徒歩2分。医療関係者も絶賛の技術力。LINE予約記載なし。LINE AI受付で予約管理効率化提案が有効'],
    ['2026-03-16', 'モニター院候補', 4, '墨田区', 'いがらし接骨院スポーツはりきゅう', '墨田区石原1-28-12', '03-3624-9990', 'あり', '不明（LINE情報なし）', '電話・EPARK', '不明', '不明', 'A', '両国駅徒歩8分。スポーツ特化で予約電話が多い可能性。施術中の電話対応負担軽減の切り口で提案可能'],
    ['2026-03-16', 'モニター院候補', 5, '墨田区', '両国駅前スポーツ健康医療鍼灸接骨院', '墨田区両国4-32-2', '03-5669-8115', 'あり', '不明', '電話・Web', '不明', '不明', 'B', '両国駅徒歩3分。11店舗展開グループ。導入されれば横展開も期待。決裁は本部にある可能性。現場ニーズヒアリングから']
  ];

  // シート名
  const hSheetName = 'H-2026-03-16 リサーチ';
  const lSheetName = 'L-2026-03-16 リサーチ';

  // 既存シート一覧を取得
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existingSheets = meta.data.sheets.map(s => s.properties.title);

  // H事業シート作成（存在しなければ）
  if (!existingSheets.includes(hSheetName)) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: hSheetName } } }]
      }
    });
    console.log(`シート「${hSheetName}」を作成しました`);
  } else {
    // 既存シートをクリア
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${hSheetName}'!A:Z`
    });
    console.log(`シート「${hSheetName}」をクリアしました`);
  }

  // L事業シート作成（存在しなければ）
  if (!existingSheets.includes(lSheetName)) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: lSheetName } } }]
      }
    });
    console.log(`シート「${lSheetName}」を作成しました`);
  } else {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${lSheetName}'!A:Z`
    });
    console.log(`シート「${lSheetName}」をクリアしました`);
  }

  // H事業データ書き込み
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${hSheetName}'!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: hData }
  });
  console.log(`H事業リサーチ ${hData.length - 1}件を書き込みました`);

  // L事業データ書き込み
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${lSheetName}'!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: lData }
  });
  console.log(`L事業リサーチ ${lData.length - 1}件を書き込みました`);

  console.log('\n=== 完了 ===');
  console.log(`H事業: ${hSheetName} → ${hData.length - 1}社`);
  console.log(`L事業: ${lSheetName} → ${lData.length - 1}院`);
}

main().catch(console.error);
