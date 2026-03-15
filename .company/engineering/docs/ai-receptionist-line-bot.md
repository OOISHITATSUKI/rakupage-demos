---
created: "2026-03-14"
topic: "整骨院AI受付 LINE Bot"
type: technical-doc
tags: [line-bot, ai, messaging-api, mvp]
---

# 整骨院AI受付 LINE Bot - 技術設計書

## 概要

整骨院・接骨院向けの「AI受付スタッフ」LINE Bot。
既存のLINE公式アカウントにMessaging APIで接続し、AIが自動で予約受付・問い合わせ対応・施術後フォローを行う。

### ゴール（MVP）
- LINE上でAIが自然な会話で予約を受け付ける
- 症状ヒアリング → メニュー提案 → 空き枠提示 → 予約確定
- よくある質問への自動回答
- 予約リマインド通知

## 設計・方針

### アーキテクチャ

```
┌─────────────┐     Webhook      ┌──────────────────┐
│  LINE App   │ ──────────────→  │  Express Server  │
│  (患者側)   │ ←────────────── │  (Node.js)       │
└─────────────┘   Reply API      │                  │
                                 │  ├─ LINE SDK     │
┌─────────────┐                  │  ├─ AI Engine    │──→ Claude API
│  LINE公式   │  Messaging API   │  ├─ Booking DB   │     (Anthropic)
│  管理画面   │ ←──────────────→ │  └─ Admin API    │
│  (院側)     │                  └──────────────────┘
└─────────────┘                          │
                                         ▼
                                  ┌──────────────┐
                                  │  SQLite DB   │
                                  │  (予約・患者) │
                                  └──────────────┘
```

### 技術スタック

| レイヤー | 技術 | 理由 |
|---------|------|------|
| ランタイム | Node.js v22 | 既存環境にインストール済み |
| フレームワーク | Express.js | 軽量・シンプル |
| LINE連携 | @line/bot-sdk | 公式SDK |
| AI | Claude API (Anthropic) | 日本語の自然な会話が強い |
| DB | SQLite (better-sqlite3) | MVPではファイルベースで十分。サーバーレス移行も容易 |
| 公開 | ngrok | 開発時のWebhookトンネル |

### ディレクトリ構成

```
line-ai-receptionist/
├── package.json
├── .env                    # LINE・Claude APIキー
├── src/
│   ├── index.js            # Expressサーバー起動
│   ├── line/
│   │   ├── webhook.js      # Webhookハンドラ
│   │   └── reply.js        # LINE返信ヘルパー
│   ├── ai/
│   │   ├── engine.js       # Claude API呼び出し
│   │   ├── prompts.js      # システムプロンプト（整骨院特化）
│   │   └── context.js      # 会話コンテキスト管理
│   ├── booking/
│   │   ├── manager.js      # 予約CRUD
│   │   ├── slots.js        # 空き枠管理
│   │   └── reminder.js     # リマインド通知
│   ├── clinic/
│   │   └── config.js       # 院の設定（メニュー・営業時間等）
│   └── db/
│       ├── schema.sql      # テーブル定義
│       └── database.js     # DB接続・初期化
├── clinic-config.json      # 院ごとの設定ファイル
└── README.md
```

## 詳細

### 1. 会話フロー設計

```
患者: 友だち追加
  → Bot: 「○○整骨院です！ご予約やご質問はお気軽にどうぞ」

患者: 「腰が痛いんですが」
  → AI: 症状ヒアリング（いつから？どんな時に痛い？）
  → AI: 「腰痛には【骨盤矯正コース(30分)】がおすすめです。ご予約されますか？」

患者: 「予約したい」
  → AI: 「ご希望の日時はありますか？直近の空き枠はこちらです:
         ・3/15(月) 10:00 / 14:00 / 16:30
         ・3/16(火) 11:00 / 15:00」

患者: 「15日の14時で」
  → AI: 「3/15(月) 14:00〜 骨盤矯正コースでご予約を承りました！
         お名前をお願いします」

患者: 「田中です」
  → AI: 「田中様、ご予約確定です！
         ■ 3/15(月) 14:00〜14:30
         ■ 骨盤矯正コース
         ■ ○○整骨院
         前日にリマインドをお送りしますね。お大事にどうぞ！」
```

### 2. AIプロンプト設計（核心部分）

AIには以下のシステムプロンプトを与える:

- あなたは○○整骨院のAI受付スタッフです
- 患者に寄り添い、丁寧で親しみやすい口調で対話してください
- 症状を聞いて適切な施術メニューを提案してください
- 予約を取る際は、空き枠情報をツール呼び出しで確認してください
- 営業時間外の質問にも24時間対応してください
- 保険適用の可否など医療判断はせず、「詳しくは来院時にご相談ください」と案内

Claude APIの **tool_use** 機能で以下をAIに持たせる:
- `get_available_slots(date)` - 空き枠取得
- `create_booking(date, time, menu, name)` - 予約作成
- `get_clinic_info(query)` - 院情報の取得（営業時間、アクセス等）
- `get_menu_list()` - 施術メニュー一覧取得

### 3. DBスキーマ

```sql
-- 患者
CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  line_user_id TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 施術メニュー
CREATE TABLE menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price INTEGER,
  description TEXT,
  symptoms TEXT  -- カンマ区切りの対応症状
);

-- 予約
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER REFERENCES patients(id),
  menu_id INTEGER REFERENCES menus(id),
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',  -- confirmed / cancelled / completed
  reminded INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 会話履歴（コンテキスト保持用）
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  line_user_id TEXT NOT NULL,
  role TEXT NOT NULL,        -- user / assistant
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 営業時間
CREATE TABLE business_hours (
  day_of_week INTEGER NOT NULL,  -- 0=日, 1=月, ..., 6=土
  open_time TEXT,
  close_time TEXT,
  is_closed INTEGER DEFAULT 0
);
```

### 4. 院ごとの設定ファイル (clinic-config.json)

```json
{
  "clinic_name": "サンプル整骨院",
  "address": "東京都渋谷区...",
  "phone": "03-xxxx-xxxx",
  "business_hours": {
    "mon": { "open": "09:00", "close": "19:30" },
    "tue": { "open": "09:00", "close": "19:30" },
    "wed": { "open": "09:00", "close": "19:30" },
    "thu": { "open": "09:00", "close": "19:30" },
    "fri": { "open": "09:00", "close": "19:30" },
    "sat": { "open": "09:00", "close": "17:00" },
    "sun": null
  },
  "lunch_break": { "start": "12:30", "end": "15:00" },
  "slot_duration_minutes": 30,
  "menus": [
    {
      "name": "骨盤矯正コース",
      "duration": 30,
      "price": 4500,
      "symptoms": ["腰痛", "骨盤の歪み", "産後"]
    },
    {
      "name": "肩こり改善コース",
      "duration": 30,
      "price": 4000,
      "symptoms": ["肩こり", "首の痛み", "頭痛"]
    },
    {
      "name": "交通事故治療",
      "duration": 40,
      "price": 0,
      "symptoms": ["交通事故", "むちうち"]
    },
    {
      "name": "初回カウンセリング",
      "duration": 60,
      "price": 3000,
      "symptoms": []
    }
  ],
  "faq": {
    "駐車場": "院の前に2台分の駐車スペースがあります",
    "保険": "症状によって保険適用が可能です。詳しくは来院時にご相談ください",
    "予約なし": "予約優先制ですが、空きがあれば当日のご来院も可能です",
    "服装": "動きやすい服装でお越しください。お着替えもご用意しています"
  }
}
```

### 5. MVP実装の優先順位

| 優先度 | 機能 | 工数 |
|--------|------|------|
| P0 | LINE Webhook受信 + AIで返信 | 小 |
| P0 | 院情報に基づいた自然な会話 | 小 |
| P0 | 予約受付（空き枠提示→確定） | 中 |
| P1 | 予約リマインド（前日通知） | 小 |
| P1 | 症状→メニュー提案 | 小（AI promptで対応） |
| P2 | 管理画面（Web） | 大（MVP後） |
| P2 | 複数院対応 | 大（MVP後） |

### 6. 必要なAPIキー

- `LINE_CHANNEL_ACCESS_TOKEN` - LINE Messaging API
- `LINE_CHANNEL_SECRET` - Webhook署名検証用
- `ANTHROPIC_API_KEY` - Claude API

## 参考
- LINE Messaging API: https://developers.line.biz/ja/docs/messaging-api/
- @line/bot-sdk: https://github.com/line/line-bot-sdk-nodejs
- Claude API tool_use: https://docs.anthropic.com/en/docs/tool-use
