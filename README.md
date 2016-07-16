# DreamHouse サンプルアプリ用の Slack Bot

DreamHouse サンプルアプリケーションで使用する、Salesforce ベースの Slack Botです。

ボットのインスタンスを作成するには、以下の手順を実行します。

### ステップ 1：DreamHouse アプリをインストールする

DreamHouse サンプルアプリケーションをまだインストールしていない場合は、[この手順](http://dreamhouseappjp.io/installation/)を実行してインストールします。

### ステップ 2：接続アプリケーションを作成する

Salesforce 接続アプリケーションをまだ作成していない場合は、以下の手順を実行して作成します。

1. Salesforce の［設定］で、クイック検索ボックスに「**アプリ**」と入力して［**アプリケーション**］リンクをクリックします。

1. ［**接続アプリケーション**］セクションで、［**新規**］をクリックし、次のように接続アプリケーションを定義します。

    - 接続アプリケーション名：DreamhouseJpSlackBot（または任意の名前）
    - API 参照名：DreamhouseJpSlackBot
    - 取引先責任者メール：自分のメールアドレスを入力します。
    - OAuth 設定の有効化：チェックボックスをオンにします。
    - コールバック URL：http://localhost:8200/oauthcallback.html
    - 選択した OAuth 範囲：フルアクセス（full）
    - ［**保存**］をクリックします。

## ステップ 3：Slack でBotユーザーを作成する

[この手順](https://api.slack.com/bot-users) に従って、Slack でボットユーザーを作成します。

## ステップ 4：ボットをデプロイしインストールする

1. [Heroku ダッシュボード](https://dashboard.heroku.com/)にログインしていることを確認します。

1. 下のボタンをクリックして、Messenger Bot を Heroku にデプロイします。

    [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

1. 以下の通りに環境変数を設定します。

    - ［**SLACK_BOT_TOKEN**］：先ほど作成したSlack Botユーザのトークンを入力します。
    - ［**SF_CLIENT_ID**］：Salesforce 接続アプリケーションのコンシューマキーを入力します。
    - ［**SF_CLIENT_SECRET**］：Salesforce 接続アプリケーションのコンシューマの秘密を入力します。
    - ［**SF_USER_NAME**］：Salesforce 統合ユーザーのユーザー名を入力します。
    - ［**SF_PASSWORD**］：Salesforce 統合ユーザーのパスワードを入力します。

1. Salesforce統合用のユーザがログインできるように、IPアドレス制限の解除や接続アプリケーションの使用権限を付与しておきます。

1. Slack の Direct Messages でボットを選択します。「Help」と入力すると、どのようなことができるかが表示されますので、ボットとのチャットを早速始めてみてください。
