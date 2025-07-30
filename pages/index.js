import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [threadId, setThreadId] = useState(null);
	const endRef = useRef(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

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

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ 
					messages: [...messages, userMessage], 
					threadId 
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to get response');
			}

			const data = await response.json();
			const assistantMessage = { 
				id: data.id, 
				role: data.role, 
				content: data.content 
			};
			
			setMessages(prev => [...prev, assistantMessage]);
			
			if (data.threadId && data.threadId !== threadId) {
				setThreadId(data.threadId);
			}
		} catch (err) {
			console.error('Error:', err);
			setError(err.message);
			// Remove the user message if the API call failed
			setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
		} finally {
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
							<p className="text-sm text-muted mb-2">Islamic Scholar & Author</p>
							<p className="text-sm mb-2">Dr. Laleh Bakhtiar was a renowned scholar and author, known for her translation of the Quran and contributions to Islamic studies.</p>
							<p className="text-sm">Explore Islam, Sufism, and the significance of her translation of the Quran with Laleh Al, an interactive tool that offers a deep dive into the life and works of the late scholar Dr. Laleh Bakhtiar.</p>
						</div>
					</div>
					
					{/* Desktop layout: vertical centered */}
					<div className="hidden lg:flex flex-col items-center">
						<Image src="/images/laleh.jpg" alt="Dr. Laleh Bakhtiar" width={120} height={120} className="rounded-full mb-4" />
						<h2 className="text-xl font-semibold">Laleh AI</h2>
						<p className="text-sm text-muted mb-2">Islamic Scholar & Author</p>
						<p className="text-center text-sm mb-4">Dr. Laleh Bakhtiar was a renowned scholar and author, known for her translation of the Quran and contributions to Islamic studies.</p>
						<p className="text-center text-sm mb-4">Explore Islam, Sufism, and the significance of her translation of the Quran with Laleh Al, an interactive tool that offers a deep dive into the life and works of the late scholar Dr. Laleh Bakhtiar.</p>
						{/* <button className="bg-accent text-accent-foreground px-4 py-1 rounded-md text-sm font-medium hover:opacity-90">Follow</button> */}
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
						{isLoading && (
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
