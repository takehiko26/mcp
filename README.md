# 株価情報アプリ

米国上場企業の株価情報を表示するWebアプリケーションです。

## 技術スタック

- **フロントエンド**: React
- **バックエンド**: FastAPI
- **API**: Alpha Vantage

## セットアップ

### 1. Alpha Vantage APIキーの取得

1. [Alpha Vantage](https://www.alphavantage.co/support/#api-key)でAPIキーを取得
2. `.env`ファイルを作成し、APIキーを設定

```bash
cp .env.example .env
# .env ファイルを編集してAPIキーを設定
```

### 2. バックエンドの起動

```bash
cd backend
pip install -r requirements.txt
python main.py
```

バックエンドは `http://localhost:8000` で起動します。

### 3. フロントエンドの起動

```bash
cd frontend
npm install
npm start
```

フロントエンドは `http://localhost:3000` で起動します。

## 使用方法

1. Webブラウザで `http://localhost:3000` にアクセス
2. ティッカーコード（例: AAPL, GOOGL, TSLA）を入力
3. 「株価を検索」ボタンをクリック
4. 最新の株価情報が表示されます

## 機能

- 指定したティッカーコードの株価情報取得
- 現在価格、変動額、変動率の表示
- 始値、高値、安値、出来高の表示
- エラーハンドリングとユーザーフレンドリーなエラーメッセージ
- ログ出力（バックエンド）

## API エンドポイント

- `GET /health` - ヘルスチェック
- `GET /stock/{symbol}` - 指定したシンボルの株価情報取得