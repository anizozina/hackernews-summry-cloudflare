export class SlackClient {
	constructor(private webhookUrl: string) {}

	async sendMessage(summary: string, meta: string) {
		if (!summary) return;
		await fetch(this.webhookUrl, {
			method: 'POST',
			body: JSON.stringify({
				blocks: [
					{
						type: 'section',
						block_id: '1',
						text: { type: 'mrkdwn', text: summary },
					},
					{
						type: 'divider',
						block_id: '2',
					},
					{
						type: 'context',
						block_id: '3',
						elements: [{ type: 'mrkdwn', text: meta }],
					},
				],
			}),
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		});
	}
}
