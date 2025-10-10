import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [threadId, setThreadId] = useState(null);
	const [streamingMessage, setStreamingMessage] = useState(null);
	const endRef = useRef(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, streamingMessage]);

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;
	
		const userMessage = { id: Date.now().toString(), role: 'user', content: input };
		setMessages(prev => [...prev, userMessage]);
		setInput('');
		setError(null);
		setIsLoading(true);
		setStreamingMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: '' });
	
		let accumulatedContent = '';
		let finalResponse = null;
	
		try {
			const res = await fetch('/api/ask', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ question: input, threadId }),
			});
	
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';
	
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
	
				buffer += decoder.decode(value, { stream: true });
	
				const parts = buffer.split('\n\n');
				buffer = parts.pop(); // Keep incomplete part
	
				for (const part of parts) {
					if (part.startsWith('data: ')) {
						const json = part.slice(6).trim();
						try {
							const data = JSON.parse(json);
	
							switch (data.type) {
								case 'content':
									accumulatedContent += data.content;
									setStreamingMessage(prev => ({
										...prev,
										content: accumulatedContent,
									}));
									break;
	
								case 'final':
									finalResponse = data.data;
									setThreadId(data.data.threadId);
									break;
	
								case 'error':
									throw new Error(data.error);
							}
						} catch (err) {
							console.error('JSON parse error:', err, part);
						}
					} else if (part.startsWith('event: end')) {
						console.log('Stream ended');
					}
				}
			}
	
			if (finalResponse) {
				setMessages(prev => [...prev, {
					id: finalResponse.id,
					role: finalResponse.role,
					content: finalResponse.content,
					sources: finalResponse.sources
				}]);
			} else if (accumulatedContent) {
				setMessages(prev => [...prev, {
					id: Date.now().toString(),
					role: 'assistant',
					content: accumulatedContent
				}]);
			}
	
			setStreamingMessage(null);
			setIsLoading(false);
	
		} catch (err) {
			console.error('Error:', err);
			setError(err.message);
			setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
			setStreamingMessage(null);
			setIsLoading(false);
		}
	};

	return (
		<main className="bg-background text-foreground">
			{/* Responsive Sidebar - Fixed on mobile at top, fixed on desktop at left */}
			<aside className="w-full lg:w-80 bg-card p-6 shadow-md relative overflow-hidden fixed top-0 left-0 z-20 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:z-10" style={{
				backgroundImage: 'url(/images/laleh-background.png)',
				backgroundSize: 'cover',
				backgroundPosition: 'right center',
				backgroundRepeat: 'no-repeat'
			}}>
				{/* Overlay to ensure text readability */}
				<div className="absolute inset-0 bg-black/60"></div>
				{/* Content with relative positioning to appear above overlay */}
				<div className="relative z-10">
					{/* Mobile layout: horizontal with image on left */}
					<div className="lg:hidden flex items-start gap-4">
						<Image src="/images/laleh.jpg" alt="Dr. Laleh Bakhtiar" width={80} height={80} className="rounded-full flex-shrink-0" />
						<div className="flex-1 min-w-0">
  <h2 className="text-lg font-semibold">Laleh AI</h2>
  <p className="text-sm mb-2">
    Experience Laleh AI, an interactive space built from the writings and wisdom of the late Dr. Laleh Bakhtiar, pioneering scholar, translator, and interfaith thinker.
  </p>
  <p className="text-sm italic text-muted mb-1">Try asking:</p>
  <div className="pl-4 text-sm text-muted-foreground italic space-y-1">
    <p>💬 “How did <strong>Little Women</strong> inspire Dr. Laleh Bakhtiar growing up in D.C.?”</p>
    <p>💬 “How did Dr. Seyyed Hossein Nasr guide her as a mentor?”</p>
    <p>💬 “What was Dr. Laleh Bakhtiar’s approach to interfaith understanding?”</p>
    <p>💬 “How did Dr. Laleh Bakhtiar reimagine chivalry as a code of compassion and integrity?”</p>
  </div>
  <p className="text-sm mt-3">
    Before she passed, Dr. Bakhtiar began recording her reflections and stories with her children, inspiring the creation of Laleh AI — a way to engage with her wisdom through the data of her writings, notes, and lectures, and to explore her timeless ideas on faith, spirit, and humanity.
  </p>
</div>
					</div>
					
{/* Desktop layout: vertically centered */}
<div className="hidden lg:flex flex-col items-center text-center max-w-md mx-auto">
  <Image
    src="/images/laleh.jpg"
    alt="Dr. Laleh Bakhtiar"
    width={120}
    height={120}
    className="rounded-full mb-4"
  />
  <h2 className="text-xl font-semibold">Laleh AI</h2>
  <p className="text-sm mb-3">
    Experience Laleh AI, an interactive space built from the writings and wisdom of the late Dr. Laleh Bakhtiar, pioneering scholar, translator, and interfaith thinker.
  </p>
  <p className="text-sm italic text-muted mb-1">Try asking:</p>
  <div className="text-sm text-muted-foreground italic space-y-1 mb-4">
    <p>💬 “How did <strong>Little Women</strong> inspire Dr. Laleh Bakhtiar growing up in D.C.?”</p>
    <p>💬 “How did Dr. Seyyed Hossein Nasr guide her as a mentor?”</p>
    <p>💬 “What was Dr. Laleh Bakhtiar’s approach to interfaith understanding?”</p>
    <p>💬 “How did Dr. Laleh Bakhtiar reimagine chivalry as a code of compassion and integrity?”</p>
  </div>
  <p className="text-sm">
    Before she passed, Dr. Bakhtiar began recording her reflections and stories with her children, inspiring the creation of Laleh AI — a way to engage with her wisdom through the data of her writings, notes, and lectures, and to explore her timeless ideas on faith, spirit, and humanity.
  </p>
  {/* <button className="bg-accent text-accent-foreground px-4 py-1 rounded-md text-sm font-medium hover:opacity-90 mt-3">Follow</button> */}
</div>
				</div>
			</aside>

			{/* Chat Interface - Takes remaining height on mobile, full height with margin on desktop */}
			<section className="absolute top-[220px] left-0 right-0 bottom-0 lg:relative lg:top-0 lg:ml-80 lg:right-auto lg:h-screen flex flex-col">
				{/* Messages Area - Scrollable */}
				<div className="flex-1 overflow-y-auto p-4 lg:p-10">
					{error && (
						<div className="bg-red-500 text-white p-4 rounded-lg mb-4">
							Error: {error}
						</div>
					)}
					<div className="flex flex-col space-y-4 animate-fade-in">
						{messages.map((m, i) => (
							<div key={i} className={`max-w-xl p-4 rounded-lg shadow-sm transition-all duration-300 ${m.role === 'user' ? 'self-end bg-message-user text-message-user-foreground' : 'self-start bg-message-ai text-message-ai-foreground'} animate-fade-in`}>
								{m.role === 'user' ? (
									<div>{m.content}</div>
								) : (
									<div className="prose prose-sm prose-invert max-w-none">
										<ReactMarkdown 
											components={{
												p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
												ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
												ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
												li: ({children}) => <li className="text-sm">{children}</li>,
												strong: ({children}) => <strong className="font-semibold">{children}</strong>,
												em: ({children}) => <em className="italic">{children}</em>,
												code: ({children}) => <code className="bg-gray-700 px-1 py-0.5 rounded text-xs">{children}</code>,
												blockquote: ({children}) => <blockquote className="border-l-4 border-accent pl-4 italic text-sm">{children}</blockquote>,
											}}
										>
											{m.content}
										</ReactMarkdown>
									</div>
								)}
							</div>
						))}
						
						{/* Streaming message */}
						{streamingMessage && (
							<div className="self-start bg-message-ai text-message-ai-foreground max-w-xl p-4 rounded-lg shadow-sm animate-fade-in">
								<div className="prose prose-sm prose-invert max-w-none">
									<ReactMarkdown 
										components={{
											p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
											ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
											ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
											li: ({children}) => <li className="text-sm">{children}</li>,
											strong: ({children}) => <strong className="font-semibold">{children}</strong>,
											em: ({children}) => <em className="italic">{children}</em>,
											code: ({children}) => <code className="bg-gray-700 px-1 py-0.5 rounded text-xs">{children}</code>,
											blockquote: ({children}) => <blockquote className="border-l-4 border-accent pl-4 italic text-sm">{children}</blockquote>,
										}}
									>
										{streamingMessage.content || 'Thinking...'}
									</ReactMarkdown>
									{isLoading && (
										<span className="inline-block w-2 h-4 bg-current animate-pulse ml-1"></span>
									)}
								</div>
							</div>
						)}
						
						{isLoading && !streamingMessage && (
							<div className="self-start bg-message-ai text-message-ai-foreground max-w-xl p-4 rounded-lg shadow-sm animate-fade-in">
								<div className="flex items-center space-x-2">
									<div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
									<span className="text-sm">Laleh AI is working...</span>
								</div>
							</div>
						)}
						<div ref={endRef} />
					</div>
				</div>

				{/* Input Field - Fixed at bottom */}
				<div className="flex-shrink-0 p-4 lg:p-10 pt-0 lg:pt-0">
					<form onSubmit={handleSubmit} className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-input text-input-foreground w-full mx-auto">
						<input 
							className="flex-1 bg-transparent outline-none placeholder:text-muted" 
							value={input} 
							placeholder="Ask Laleh AI..." 
							onChange={handleInputChange}
							disabled={isLoading}
						/>
						<button 
							type="submit" 
							className="bg-accent text-accent-foreground rounded-md px-3 py-1 hover:opacity-90 disabled:opacity-50"
							disabled={isLoading}
						>
							{isLoading ? '...' : '➤'}
						</button>
					</form>
				</div>
			</section>
		</main>
	);
}
