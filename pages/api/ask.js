import openai from '../../lib/openai';

let fileNameCache = {};

async function getFileName(fileId) {
	if (fileNameCache[fileId]) return fileNameCache[fileId];
	const file = await openai.files.retrieve(fileId);
	fileNameCache[fileId] = file.filename;
	return file.filename;
}

export default async function handler(req, res) {
	console.log('API called with:', req.body);
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
		tool_choice: "required"
	  });

	let status = run.status;
	while (status !== 'completed' && status !== 'failed' && status !== 'cancelled') {
		await new Promise(r => setTimeout(r, 1000));
		const updated = await openai.beta.threads.runs.retrieve(threadId, run.id);
		status = updated.status;
	}

	const messages = await openai.beta.threads.messages.list(threadId);
	const sortedMessages = messages.data.sort((a, b) => b.created_at - a.created_at);
	const answerMessage = sortedMessages.find(m => m.role === 'assistant');
	const answer = answerMessage?.content[0]?.text?.value || 
	"I'm sorry, I couldn't find anything related to that question in the provided documents.";
	console.log('Answer:', answer);

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

	const response = {
		id: Date.now().toString(),
		role: 'assistant',
		content: answer,
		threadId,
		sources,
	};
	
	console.log('Sending response:', response);
	res.status(200).json(response);
}
