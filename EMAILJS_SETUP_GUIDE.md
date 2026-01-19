# EmailJS設定ガイド

このガイドでは、フォームから `sales@bestruck.co.jp` にメールを送信するためのEmailJSの設定方法を詳しく説明します。

---

## ステップ1: EmailJSアカウントの作成

1. **EmailJSの公式サイトにアクセス**
   - https://www.emailjs.com/ を開く
   - 「Sign Up」または「Get Started」をクリック

2. **アカウント登録**
   - メールアドレスとパスワードを入力
   - または、Googleアカウントでログイン（推奨）

3. **ダッシュボードにアクセス**
   - ログイン後、EmailJSのダッシュボードが表示されます

---

## ステップ2: メールサービスの設定

EmailJSで使用するメールサービス（Gmail、Outlookなど）を設定します。

### 2-1. サービス一覧から選択

1. 左側のメニューから「**Email Services**」をクリック
2. 「**Add New Service**」ボタンをクリック

### 2-2. サービスプロバイダーの選択

以下のいずれかを選択します：

#### オプションA: Gmailを使用する場合（推奨）

1. 「**Gmail**」を選択
2. 「**Connect Account**」をクリック
3. Googleアカウントでログインして認証
4. サービス名を入力（例: `gmail_bestruck`）
5. 「**Create Service**」をクリック

#### オプションB: その他のメールサービスを使用する場合

1. 使用するメールサービスを選択（Outlook、Yahoo Mailなど）
2. 各サービスの指示に従って設定
3. サービス名を入力
4. 「**Create Service**」をクリック

### 2-3. サービスIDの確認

サービス作成後、以下の情報が表示されます：
- **Service ID**: 後で使用するのでメモしておきます（例: `service_abc123`）

---

## ステップ3: メールテンプレートの作成

送信するメールのテンプレートを作成します。

### 3-1. テンプレートの作成

1. 左側のメニューから「**Email Templates**」をクリック
2. 「**Create New Template**」をクリック

### 3-2. テンプレートの設定

以下のように設定します：

#### 基本設定

- **Template Name**: `資料申し込みフォーム`（任意の名前）
- **Subject**: `【ナットチェッカー】資料・サンプル申し込み`

#### メール本文

以下の内容をコピーして貼り付けます：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【ナットチェッカー】資料・サンプル申し込み
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

以下の内容で資料・サンプルの申し込みがありました。

【ご希望の資料】
{{material_type}}

【会社名】
{{company_name}}

【お名前】
{{name}}

【メールアドレス】
{{from_email}}

【電話番号】
{{phone}}

【送付先住所】
{{address}}

【保有台数】
{{vehicle_count}}

【ご質問・ご要望】
{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
送信日時: {{date}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 送信先の設定

- **To Email**: `sales@bestruck.co.jp`
- **From Name**: `{{from_name}}`
- **From Email**: `{{from_email}}`
- **Reply To**: `{{reply_to}}`

### 3-3. テンプレートIDの確認

テンプレート保存後、以下の情報が表示されます：
- **Template ID**: 後で使用するのでメモしておきます（例: `template_xyz789`）

---

## ステップ4: Public Keyの取得

1. 左側のメニューから「**Account**」をクリック
2. 「**General**」タブを開く
3. 「**Public Key**」の値をコピーします（例: `abcdefghijklmnop`）

---

## ステップ5: コードへの設定値の適用

取得した設定値を `script.js` に適用します。

### 5-1. script.jsファイルを開く

プロジェクトの `script.js` ファイルを開きます。

### 5-2. 設定値を更新

以下の部分を見つけて、実際の値に置き換えます：

```javascript
// EmailJSの設定（実際の値に置き換えてください）
const serviceId = 'x-YY5DTRppsuFBQf-'; // ← ステップ2-3で取得したService ID
const templateId = 'YOUR_TEMPLATE_ID'; // ← ステップ3-3で取得したTemplate ID
const publicKey = 'YOUR_PUBLIC_KEY'; // ← ステップ4で取得したPublic Key
```

**例：**
```javascript
const serviceId = 'service_abc123';
const templateId = 'template_xyz789';
const publicKey = 'abcdefghijklmnop';
```

### 5-3. EmailJSの初期化を有効化

`script.js` の以下の部分のコメントを外します：

```javascript
// EmailJSを初期化（まだ初期化されていない場合）
if (typeof emailjs !== 'undefined') {
    emailjs.init(publicKey); // ← この行が実行されるようにします
    // ...
}
```

---

## ステップ6: 動作確認

### 6-1. ローカルでテスト

1. ブラウザで `index.html` を開く
2. フォームにテストデータを入力
3. 「無料で内容を確認する」ボタンをクリック
4. 感謝ページが表示されることを確認

### 6-2. メール送信の確認

1. `sales@bestruck.co.jp` のメールボックスを確認
2. フォーム送信内容がメールで届いているか確認

### 6-3. エラーが発生した場合

ブラウザの開発者ツール（F12）のコンソールを確認：
- エラーメッセージを確認
- EmailJSの設定値が正しいか再確認

---

## トラブルシューティング

### 問題1: メールが送信されない

**解決方法：**
- EmailJSのダッシュボードで「Email Logs」を確認
- エラーメッセージを確認
- Service ID、Template ID、Public Keyが正しいか確認

### 問題2: 「EmailJSが読み込まれていません」という警告

**解決方法：**
- `index.html` にEmailJSのスクリプトタグが正しく追加されているか確認
- インターネット接続を確認

### 問題3: メールがスパムフォルダに入る

**解決方法：**
- EmailJSの「Email Settings」でSPFレコードを設定
- 送信元メールアドレスの認証を確認

---

## セキュリティに関する注意事項

1. **Public Keyの保護**
   - Public Keyはフロントエンドに公開されますが、使用量制限があります
   - 必要に応じて、EmailJSのダッシュボードで使用量制限を設定

2. **メール送信の制限**
   - 無料プランでは月200通まで
   - それ以上は有料プランが必要

3. **バックエンドAPIの推奨**
   - 本番環境では、バックエンドAPI経由でのメール送信を推奨
   - より安全で制御しやすい方法です

---

## 参考リンク

- EmailJS公式ドキュメント: https://www.emailjs.com/docs/
- EmailJSサンプルコード: https://www.emailjs.com/docs/examples/

---

## 設定値のまとめ

設定完了後、以下の値をメモしておくと便利です：

```
Service ID: _______________________
Template ID: _______________________
Public Key: _______________________
```

これらの値は `script.js` の以下の部分に設定します：

```javascript
const serviceId = 'ここにService ID';
const templateId = 'ここにTemplate ID';
const publicKey = 'ここにPublic Key';
```
