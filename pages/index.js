import { useState } from 'react';

export default function Home() {
	const [file, setFile] = useState(null);
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [uploadProgress, setUploadProgress] = useState(null); // Number (0–100) or string status

	async function uploadPDF() {
		if (!file) return alert('Please select a PDF first.');

		setUploadProgress(0);

		const formData = new FormData();
		formData.append('file', file);

		const xhr = new XMLHttpRequest();

		xhr.upload.onprogress = e => {
			if (e.lengthComputable) {
				const percent = Math.round((e.loaded / e.total) * 100);
				setUploadProgress(percent);
			}
		};

		xhr.onload = () => {
			if (xhr.status === 200) {
				setUploadProgress('Embedding complete ✅');
			} else {
				setUploadProgress('Upload failed ❌');
			}
		};

		xhr.onerror = () => {
			setUploadProgress('Upload error ❌');
		};

		xhr.open('POST', '/api/embed');
		xhr.send(formData);
	}

	async function ask() {
		setAnswer('Thinking...');
		const res = await fetch('/api/ask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ question }),
		});
		const data = await res.json();
		setAnswer(data.answer);
	}

	return (
		<main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
			<h1>Laleh AI – Ask a Question</h1>

			<section style={{ marginBottom: '2rem' }}>
				<input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
				<button onClick={uploadPDF} style={{ marginLeft: '1rem' }}>
					Upload PDF
				</button>

				{typeof uploadProgress === 'number' && (
					<div style={{ marginTop: '1rem', width: '100%', maxWidth: '400px' }}>
						<progress value={uploadProgress} max="100" style={{ width: '100%' }} />
						<div>{uploadProgress}%</div>
					</div>
				)}

				{typeof uploadProgress === 'string' && <div style={{ marginTop: '1rem' }}>{uploadProgress}</div>}
			</section>

			<section>
				<input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about Laleh..." style={{ width: '300px', padding: '0.5rem' }} />
				<button onClick={ask} style={{ marginLeft: '1rem' }}>
					Ask
				</button>
			</section>

			<section style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
				<h3>Answer:</h3>
				<p>{answer}</p>
			</section>
		</main>
	);
}
