import supabase from '../../lib/supabase';
import { getEmbedding } from '../../lib/utils';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
	const { question } = req.body;

	const embedding = await getEmbedding(question);

	const { data: results, error } = await supabase.rpc('match_documents', {
		query_embedding: embedding,
		match_count: 5,
	});

	if (error) {
		console.error(error);
		return res.status(500).json({ error: 'Supabase match_documents RPC failed.' });
	}

	const context = results.map(r => r.content).join('\n\n');

	const completion = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{
				role: 'system',
				content: 'You are Laleh AI, a helpful assistant that answers questions based only on the provided context.',
			},
			{
				role: 'user',
				content: `Context:\n${context}\n\nQuestion: ${question}`,
			},
		],
	});

	const answer = completion.choices[0].message.content;
	res.status(200).json({ answer });
}
