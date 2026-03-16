# ADLINK 組織構造

## 組織図
オーナー → CEO（最終確認） → 秘書（経理・リマインド） → 法務部 / ラクページ事業部 / LINE AI受付事業部

### 法務部
- リーガルチェック（契約書・利用規約・営業メール等）
- 反社チェック（取引先の反社会的勢力該当性調査）
- 契約書作成（各事業部の契約書・利用規約・NDA等）

## 事業部

### ラクページ事業部（ホームページ制作事業）
- サービス名: ラクページ
- 対象: 全国・工務店建築系（ITリテラシー弱い業種）
- HPがガタガタ・スマホ未対応の会社にデモHP作成→営業
- フロー: リサーチ → 開発 → 営業

### LINE AI受付事業部（LINE予約SaaS事業）
- サービス名: LINE AI受付
- 対象: 荒川区・台東区・墨田区・接骨院限定
- LINE AI受付予約システムの開発・営業
- 本番URL: https://ai-receptionist-i9my.onrender.com
- GitHub: https://github.com/OOISHITATSUKI/line-ai-receptionist

## 外部サービス
- Google Sheets API: リサーチ・営業記録管理
- Render: LINE Botホスティング
- LINE Messaging API: LINE AI受付のチャットボット
- Anthropic Claude API: AI応答生成

## スプレッドシート
https://docs.google.com/spreadsheets/d/1YvF6UdXDDoGsJtk4BgVb3rs7zV0IU7coJE_l7fQQTBY/edit?usp=sharing

## サービスアカウント
- メール: spreadsheet-bot@skilful-nexus-282917.iam.gserviceaccount.com
- 認証ファイル: .company/credentials/service-account.json

## Render
- URL: https://ai-receptionist-i9my.onrender.com

## ファイル命名規則
- リサーチファイルは YYYY-MM-DD- プレフィックス必須
- H事業シート名: 「H-YYYY-MM-DD xxx」
- L事業シート名: 「L-YYYY-MM-DD xxx」
