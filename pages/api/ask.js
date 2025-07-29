import openai from '../../lib/openai';

let fileNameCache = {};

async function getFileName(fileId) {
	if (fileNameCache[fileId]) return fileNameCache[fileId];
	const file = await openai.files.retrieve(fileId);
	fileNameCache[fileId] = file.filename;
	return file.filename;
}

export default async function handler(req, res) {
	const { question, threadId: clientThreadId } = req.body;

	let threadId = clientThreadId;

	if (!threadId) {
		const thread = await openai.beta.threads.create();
		threadId = thread.id;
	}

	await openai.beta.threads.messages.create(threadId, {
		role: 'user',
		content: question,
	});

	const run = await openai.beta.threads.runs.create(threadId, {
		assistant_id: process.env.ASSISTANT_ID,
	});

	let status = run.status;
	while (status !== 'completed' && status !== 'failed' && status !== 'cancelled') {
		await new Promise(r => setTimeout(r, 1000));
		const updated = await openai.beta.threads.runs.retrieve(threadId, run.id);
		status = updated.status;
	}

	const messages = await openai.beta.threads.messages.list(threadId);
	const answerMessage = messages.data[0];
	const answer = answerMessage?.content[0]?.text?.value || 'No answer found.';

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

	res.status(200).json({
		answer,
		threadId,
		sources,
	});
}
