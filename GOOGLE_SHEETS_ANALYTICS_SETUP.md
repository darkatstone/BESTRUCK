# Googleスプレッドシート アクセス解析設定ガイド

このガイドでは、FAXDM用リンクからのアクセスをGoogleスプレッドシートに記録する方法を詳しく説明します。

---

## 必要な準備

1. **Googleアカウント**（スプレッドシートを作成・管理するアカウント）
2. **Googleスプレッドシート**（データを保存するシート）
3. **Google Apps Script**（スプレッドシートにデータを書き込むスクリプト）

---

## ステップ1: Googleスプレッドシートの作成

### 1-1. スプレッドシートを作成

1. https://sheets.google.com/ にアクセス
2. 「空白」をクリックして新しいスプレッドシートを作成
3. スプレッドシートの名前を変更（例: `BESTRUCK_アクセス解析`）

### 1-2. ヘッダー行を設定

1行目に以下のヘッダーを設定します：

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| 日時 | UTM Source | UTM Medium | UTM Campaign | リファラー | User Agent | IPアドレス | ページURL | セッションID |

**設定例：**
```
A1: 日時
B1: UTM Source
C1: UTM Medium
D1: UTM Campaign
E1: リファラー
F1: User Agent
G1: IPアドレス
H1: ページURL
I1: セッションID
```

### 1-3. スプレッドシートIDを取得

1. スプレッドシートのURLを確認
   - URL例: `https://docs.google.com/spreadsheets/d/1ABC123xyz.../edit`
   - `/d/` と `/edit` の間の文字列がスプレッドシートIDです
   - 例: `1ABC123xyz...`
1DOmwWf16_8JroffsY8HtLfY7GDHxMsxkPkvBunaUDmY
2. **スプレッドシートIDをメモ**しておきます

---

## ステップ2: Google Apps Scriptの作成

### 2-1. Apps Scriptエディタを開く

1. スプレッドシート内で「拡張機能」→「Apps Script」をクリック
2. Apps Scriptエディタが開きます

### 2-2. スクリプトを記述

以下のコードをコピーして貼り付けます：

```javascript
function doPost(e) {
  try {
    // スプレッドシートを取得
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // リクエストデータを取得
    const data = JSON.parse(e.postData.contents);
    
    // 現在の日時を取得
    const timestamp = new Date();
    
    // データを配列に格納
    const row = [
      timestamp,                                    // 日時
      data.utm_source || '',                        // UTM Source
      data.utm_medium || '',                        // UTM Medium
      data.utm_campaign || '',                      // UTM Campaign
      data.referrer || '',                          // リファラー
      data.user_agent || '',                        // User Agent
      data.ip_address || '',                        // IPアドレス
      data.page_url || '',                          // ページURL
      data.session_id || ''                         // セッションID
    ];
    
    // スプレッドシートに追加
    sheet.appendRow(row);
    
    // 成功レスポンスを返す
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'データが正常に記録されました'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // エラーレスポンスを返す
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// GETリクエストにも対応（テスト用）
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    message: 'Google Apps Script is working!',
    method: 'GET'
  })).setMimeType(ContentService.MimeType.JSON);
}
```

### 2-3. スクリプトを保存

1. 「保存」ボタンをクリック（または Ctrl+S / Cmd+S）
2. プロジェクト名を入力（例: `BESTRUCK Analytics`）

---

## ステップ3: Webアプリとして公開

### 3-1. デプロイ設定

1. Apps Scriptエディタで「デプロイ」→「新しいデプロイ」をクリック
2. 「種類の選択」の横にある歯車アイコンをクリック
3. 「Web アプリ」を選択

### 3-2. デプロイ設定を入力

以下のように設定します：

- **説明**: `BESTRUCK Analytics API`（任意）
- **次のユーザーとして実行**: `自分`
- **アクセスできるユーザー**: `全員`（重要！）

### 3-3. デプロイを実行

1. 「デプロイ」ボタンをクリック
2. **初回デプロイ時は承認が必要です**：
   - 「承認が必要です」というダイアログが表示されます
   - 「承認」をクリック
   - Googleアカウントを選択
   - 「詳細」→「BESTRUCK Analytics（安全ではないページ）に移動」をクリック
   - 「許可」をクリック

### 3-4. WebアプリURLを取得

1. デプロイ完了後、**WebアプリのURL**が表示されます
   - 例: `https://script.google.com/macros/s/AKfycby.../exec`
2. **このURLをメモ**しておきます（後で `script.js` に設定します）
https://script.google.com/macros/s/AKfycbztDdkORWIjLADTgerSsrbbLbkYxwfeSlNMJHEr9VgShG8PLwCPpOV04Cx3Oz5KIQnR/exec
---

## ステップ4: コードへの実装

### 4-1. script.jsにアクセス解析コードを追加

`script.js` ファイルの最後に以下のコードを追加します：

```javascript
// ========================================
// UTMパラメータ解析とGoogleスプレッドシートへの記録
// ========================================
(function() {
    // Google Apps ScriptのWebアプリURL（ステップ3-4で取得したURL）
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL';
    
    // セッションIDを生成（既に存在する場合は取得）
    function getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }
    
    // UTMパラメータを取得
    function getUTMParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || ''
        };
    }
    
    // アクセスデータをGoogleスプレッドシートに送信
    function sendAnalyticsData() {
        // UTMパラメータが存在する場合のみ送信
        const utmParams = getUTMParams();
        const hasUTMParams = utmParams.utm_source || utmParams.utm_medium || utmParams.utm_campaign;
        
        if (!hasUTMParams) {
            return; // UTMパラメータがない場合は送信しない
        }
        
        // 送信データを準備
        const analyticsData = {
            utm_source: utmParams.utm_source,
            utm_medium: utmParams.utm_medium,
            utm_campaign: utmParams.utm_campaign,
            referrer: document.referrer || '',
            user_agent: navigator.userAgent || '',
            page_url: window.location.href,
            session_id: getSessionId()
        };
        
        // Google Apps Scriptに送信（非同期、エラーは無視）
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // CORSエラーを回避
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(analyticsData)
        }).catch(error => {
            // エラーはコンソールに出力するだけ（ユーザーには影響しない）
            console.log('Analytics送信エラー（無視されます）:', error);
        });
    }
    
    // ページ読み込み時に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sendAnalyticsData);
    } else {
        sendAnalyticsData();
    }
})();
```

### 4-2. Google Script URLを設定

上記のコード内の `YOUR_GOOGLE_SCRIPT_URL` を、ステップ3-4で取得したWebアプリURLに置き換えます。

**例：**
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

---

## ステップ5: 動作確認

### 5-1. テストアクセス

1. 以下のURLでアクセスしてテストします：
   ```
   https://bestruck.vercel.app/?utm_source=fax&utm_medium=dm&utm_campaign=faxdm_a
   ```

2. ブラウザの開発者ツール（F12）のコンソールを確認
   - エラーが表示されていないか確認

### 5-2. スプレッドシートを確認

1. Googleスプレッドシートを開く
2. 新しい行が追加されているか確認
3. データが正しく記録されているか確認

### 5-3. トラブルシューティング

**問題1: データが記録されない**

- Google Apps ScriptのWebアプリURLが正しいか確認
- Apps Scriptの「実行」タブでエラーがないか確認
- スプレッドシートの権限設定を確認

**問題2: CORSエラーが表示される**

- `mode: 'no-cors'` を使用しているため、これは正常です
- データは正常に送信されています

**問題3: 複数回アクセスしても1回しか記録されない**

- セッションIDが正しく生成されているか確認
- ブラウザのキャッシュをクリアして再試行

---

## データの確認方法

### スプレッドシートでの確認

1. **日時**: アクセスした日時が記録されます
2. **UTM Source**: `fax` が記録されます
3. **UTM Medium**: `dm` が記録されます
4. **UTM Campaign**: `faxdm_a` または `faxdm_b` が記録されます

### データ分析の例

スプレッドシートの関数を使用して分析できます：

**例1: 各キャンペーンのアクセス数を集計**
```
=COUNTIF(D:D, "faxdm_a")
=COUNTIF(D:D, "faxdm_b")
```

**例2: 日別のアクセス数を集計**
```
=QUERY(A:I, "SELECT DATE(A), COUNT(A) WHERE A IS NOT NULL GROUP BY DATE(A)")
```

---

## セキュリティに関する注意事項

1. **WebアプリURLの保護**
   - URLは公開されますが、スプレッドシートへの書き込みのみ可能
   - 必要に応じて、Apps Scriptで追加の認証を実装可能

2. **データのプライバシー**
   - IPアドレスなどの個人情報が記録されます
   - 必要に応じて、データ保持期間を設定

3. **使用量制限**
   - Google Apps Scriptには1日あたりの実行時間制限があります
   - 通常の使用では問題ありませんが、大量のアクセスがある場合は注意

---

## 参考リンク

- Google Apps Script公式ドキュメント: https://developers.google.com/apps-script
- Googleスプレッドシート公式ドキュメント: https://support.google.com/sheets

---

## 設定値のまとめ

設定完了後、以下の値をメモしておくと便利です：

```
スプレッドシートID: _______________________
WebアプリURL: _______________________
```

これらの値は `script.js` の以下の部分に設定します：

```javascript
const GOOGLE_SCRIPT_URL = 'ここにWebアプリURL';
```
