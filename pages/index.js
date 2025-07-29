import { useState } from 'react';

export default function Home() {
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [sources, setSources] = useState({});
	const [threadId, setThreadId] = useState(null);

	async function ask() {
		setAnswer('Thinking...');
		setSources({});

		const res = await fetch('/api/ask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ question, threadId }),
		});

		const data = await res.json();
		setAnswer(data.answer);
		setSources(data.sources || {});
		setThreadId(data.threadId); // Persist thread ID for follow-ups
	}

	return (
		<main style={{ padding: 40 }}>
			<h1>Laleh AI</h1>

			<div style={{ marginBottom: 20 }}>
				<input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about Laleh..." style={{ width: '300px', padding: '8px' }} />
				<button onClick={ask} style={{ marginLeft: '1rem' }}>
					Ask
				</button>
				<button
					onClick={() => {
						setThreadId(null);
						setAnswer('');
						setSources({});
					}}
					style={{ marginLeft: '1rem' }}
				>
					New Conversation
				</button>
			</div>

			<div style={{ whiteSpace: 'pre-wrap', marginBottom: 20 }}>
				<h3>Answer:</h3>
				<p>{answer}</p>
			</div>

			{Object.keys(sources).length > 0 && (
				<div>
					<h4>Sources:</h4>
					{Object.entries(sources).map(([filename, annotations]) => (
						<div key={filename} style={{ marginBottom: 10 }}>
							<strong>📄 {filename}</strong>
							<ul>
								{annotations.map((a, i) => (
									<li key={i} style={{ fontStyle: 'italic', marginBottom: 4 }}>
										“{a.text}”
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			)}
		</main>
	);
}
