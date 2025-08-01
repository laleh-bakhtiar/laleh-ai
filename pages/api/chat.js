import openai from '../../lib/openai';

let fileNameCache = {};

async function getFileName(fileId) {
	if (fileNameCache[fileId]) return fileNameCache[fileId];
	const file = await openai.files.retrieve(fileId);
	fileNameCache[fileId] = file.filename;
	return file.filename;
}

export default async function handler(req, res) {
	console.log('API called with method:', req.method);
	console.log('API called with body:', req.body);
	
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { messages, threadId: clientThreadId } = req.body;
	const lastMessage = messages[messages.length - 1];

	if (!lastMessage) {
		return res.status(400).json({ error: 'No message provided' });
	}

	try {
		let threadId = clientThreadId;

		if (!threadId) {
			const thread = await openai.beta.threads.create();
			threadId = thread.id;
		}

		// Add the user message to the thread
		await openai.beta.threads.messages.create(threadId, {
			role: 'user',
			content: lastMessage.content,
		});

		// Create a run with the assistant
		const run = await openai.beta.threads.runs.create(threadId, {
			assistant_id: process.env.ASSISTANT_ID,
			tool_choice: "required"
		});

		// Wait for the run to complete
		let status = run.status;
		while (status !== 'completed' && status !== 'failed' && status !== 'cancelled') {
			await new Promise(resolve => setTimeout(resolve, 1000));
			const updated = await openai.beta.threads.runs.retrieve(threadId, run.id);
			status = updated.status;
		}

		if (status === 'failed') {
			return res.status(500).json({ error: 'Assistant run failed' });
		}

		// Get the messages from the thread
		const threadMessages = await openai.beta.threads.messages.list(threadId);
		const sorted = threadMessages.data.sort((a, b) => b.created_at - a.created_at);
		const answerMessage = sorted.find(msg => msg.role === 'assistant');
		const answer = answerMessage?.content[0]?.text?.value || 
		"I'm sorry, I couldn't find anything related to that question in the provided documents.";
		// Return the response in the format expected by useChat
		return res.status(200).json({
			id: Date.now().toString(),
			role: 'assistant',
			content: answer,
			threadId,
		});
	} catch (error) {
		console.error('API Error:', error);
		console.error('Error stack:', error.stack);
		return res.status(500).json({ error: error.message || 'Internal server error' });
	}
} 