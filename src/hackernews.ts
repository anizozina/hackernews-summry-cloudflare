type ArticleResponse = {
	by: string;
	descendants: number;
	id: number;
	kids: number[];
	score: number;
	title: string;
	time: number;
	type: 'story';
	url: string;
};

const baseUrl = 'https://hacker-news.firebaseio.com/v0';

export const getRatedArticles = async (count: number) => {
	const ids = await getRatedStoryIds(count);
	const stories = await Promise.all(
		ids.map(async (id) => {
			const url = `${baseUrl}/item/${id}.json?print=pretty`;
			return await get<ArticleResponse>(url);
		})
	);
	return stories;
};
const getRatedStoryIds = async (count: number) => {
	const url = `${baseUrl}/beststories.json?print=pretty`;
	const bestStoryIds = await get<string[]>(url);
	console.log(`There is ${bestStoryIds.length} stories.`);
	return bestStoryIds.slice(0, count);
};
const get = async <T>(url: string): Promise<T> => {
	const result = await fetch(url, {
		method: 'GET',
	});
	return result.json();
};
