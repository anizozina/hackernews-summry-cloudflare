/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { GeminiClient } from './gemini';
import { getRatedArticles } from './hackernews';
import { SlackClient } from './slack';

export default {
	// The scheduled handler is invoked at the interval set in our wrangler.toml's
	// [[triggers]] configuration.
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		// A Cron Trigger can make requests to other endpoints on the Internet,
		// publish to a Queue, query a D1 Database, and much more.
		//
		// We'll keep it simple and make an API call to a Cloudflare API:
		const ratedArticles = await getRatedArticles(3);
		const slackClient = new SlackClient(env.SLACK_WEBHOOK_URL);
		const geminiClient = new GeminiClient(env.GEMINI_API_KEY);
		await Promise.all(
			ratedArticles.map(async (article) => {
				const summary = await geminiClient.generate(`以下に指定するURLを読み込んで、サマリーを作成してください。
URL: ${article.url}

なお、サマリーは以下の指定した形式で記載してください。
- 列挙する際は * の代わりに • を使用
- タイトルの日本語訳、要約の順に記載
- 要約は箇条書きで記載`);
				await slackClient.sendMessage(
					`📰 Hackernews Summary! 📰

\`\`\`
${summary}
\`\`\`
`,
					`🗞️ Title: ${article.title}
🗓️ Date: ${new Date(article.time).toISOString()}
💯 Score: ${article.score}
🔗 URL: ${article.url}`
				);
			})
		);

		// You could store this result in KV, write to a D1 Database, or publish to a Queue.
		// In this template, we'll just log the result:
		console.log('Success');
	},
};
