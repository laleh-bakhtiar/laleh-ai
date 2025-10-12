import openai from '../../lib/openai';

let fileNameCache = {};

async function getFileName(fileId) {
	if (fileNameCache[fileId]) return fileNameCache[fileId];
	const file = await openai.files.retrieve(fileId);
	fileNameCache[fileId] = file.filename;
	return file.filename;
}

export default async function handler(req, res) {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

	res.flushHeaders?.(); // Push headers immediately

	let question = '';
	let clientThreadId = '';

	try {
		if (req.method === 'POST') {
			const buffers = [];
			for await (const chunk of req) {
				buffers.push(chunk);
			}
			const body = JSON.parse(Buffer.concat(buffers).toString());
			question = body.question;
			clientThreadId = body.threadId;
		} else {
			question = req.query.question;
			clientThreadId = req.query.threadId;
		}

		if (!question) {
			res.write(`data: ${JSON.stringify({ type: 'error', error: 'Question is required' })}\n\n`);
			res.end();
			return;
		}

		let threadId = clientThreadId;
		if (!threadId) {
			const thread = await openai.beta.threads.create();
			threadId = thread.id;
		}

		await openai.beta.threads.messages.create(threadId, {
			role: 'user',
			content: question,
		});

		const stream = await openai.beta.threads.runs.createAndStream(threadId, {
			assistant_id: process.env.ASSISTANT_ID,
			tool_choice: 'required',
		});

		let contentBuffer = '';
		let finalResponseData = null;

		for await (const event of stream) {
			if (event.event === 'thread.message.delta') {
				const delta = event.data.delta;
				const value = delta?.content?.[0]?.text?.value;
				if (value) {
					console.log('[STREAM]', value);
					contentBuffer += value;
					res.write(`data: ${JSON.stringify({ type: 'content', content: value })}\n\n`);
					res.flush?.(); // Force flush
				}
			}

			if (event.event === 'thread.run.completed') {
				console.log('[STREAM] completed');

				const messages = await openai.beta.threads.messages.list(threadId);
				const sortedMessages = messages.data.sort((a, b) => b.created_at - a.created_at);
				const answerMessage = sortedMessages.find(m => m.role === 'assistant');
				const answer = answerMessage?.content[0]?.text?.value || '';

				const annotations = answerMessage?.content[0]?.text?.annotations || [];
				const sources = {};
				for (const a of annotations) {
					const fileId = a.file_citation?.file_id;
					if (fileId) {
						const filename = await getFileName(fileId);
						if (!sources[filename]) sources[filename] = [];
						sources[filename].push(a);
					}
				}

				finalResponseData = {
					id: Date.now().toString(),
					role: 'assistant',
					content: answer,
					threadId,
					sources,
				};

				res.write(`data: ${JSON.stringify({ type: 'final', data: finalResponseData })}\n\n`);
				res.write('event: end\ndata: end\n\n');
				res.end();
				return;
			}

			if (event.event === 'thread.run.failed') {
				console.error('[STREAM] failed');
				res.write(`data: ${JSON.stringify({ type: 'error', error: 'Assistant run failed' })}\n\n`);
				res.write('event: end\ndata: end\n\n');
				res.end();
				return;
			}
		}
	} catch (error) {
		console.error('Streaming error:', error);
		res.write(`data: ${JSON.stringify({ type: 'error', error: error.message || 'Internal server error' })}\n\n`);
		res.write('event: end\ndata: end\n\n');
		res.end();
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};