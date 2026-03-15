# ADLINK 組織構造

## 組織図
オーナー → CEO（最終確認） → 秘書（経理・リマインド） → H事業部 / L事業部

## 事業部

### H事業部（ホームページ制作事業）
- サービス名: ラクページ
- 対象: 全国・工務店建築系（ITリテラシー弱い業種）
- HPがガタガタ・スマホ未対応の会社にデモHP作成→営業
- フロー: リサーチ → 開発 → 営業

### L事業部（LINE予約SaaS事業）
- サービス名: AI受付くん
- 対象: 荒川区・台東区・墨田区・接骨院限定
- LINE AI受付予約システムの開発・営業
- 本番URL: https://ai-receptionist-i9my.onrender.com
- GitHub: https://github.com/OOISHITATSUKI/line-ai-receptionist

## 外部サービス
- Google Sheets API: リサーチ・営業記録管理
- Render: LINE Botホスティング
- LINE Messaging API: AI受付くんのチャットボット
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
