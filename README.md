## これはなに

Hckernewsのサマリーを定期的に出してくれるやつ。
CloudFlare Workersを使ってみたくてやった。

## 動かすには

- CloudFlare WorkersのProjectを作る
- GeminiのAPIキーを作成する
  - ref. https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=web&hl=ja#set-up-project
	- `npx wrangler secret put GEMINI_API_KEY`でWorkersにSecretとして登録
- Slack Webhook URLを作成する
  - `npx wrangler secret put SLACK_WEBHOOK_URL` で登録

## メモなど

- CloudFlare Workers上ではNode.jsのAPIが使えない
  - サーバーサイドで動作することが期待されるSDK等はほぼ動かない
- Geminiにこだわらず、[Workers AI](https://developers.cloudflare.com/workers/wrangler/configuration/#workers-ai)を使っても良かったかも
  - GeminiはAPIキーで動かしている
	  - ref. https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=web&hl=ja#set-up-project
