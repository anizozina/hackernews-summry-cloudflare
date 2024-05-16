import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
	private client: GoogleGenerativeAI;
	constructor(private apiKey: string) {
		this.client = new GoogleGenerativeAI(apiKey);
	}

	async generate(prompt: string) {
		const model = this.client.getGenerativeModel({model: 'gemini-pro'})
		const response = (await model.generateContent(prompt)).response;
		const result = await response.text()
		return result;
	}
}
