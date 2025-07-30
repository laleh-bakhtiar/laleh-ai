/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				background: '#0d0d0b', // Dark background
				foreground: '#e7e7e1', // Light text
				card: '#1b1b18', // Profile card background
				accent: '#9effa9', // Accent green (follow button)
				'accent-foreground': '#0d0d0b', // Text on accent
				'message-user': '#d3f9d8', // Light green bubble
				'message-user-foreground': '#0d0d0b', // Text on user message
				'message-ai': '#1a1a17', // Bot bubble background
				'message-ai-foreground': '#e7e7e1', // Text on AI message
				input: '#1b1b18', // Input background
				'input-foreground': '#e7e7e1', // Input text
				muted: '#9ca3af', // Muted text
			},
			fontFamily: {
				serif: ['Georgia', 'Cambria', 'serif'],
				sans: ['Inter', 'sans-serif'],
			},
			animation: {
				'fade-in': 'fadeIn 0.3s ease-in-out',
			},
			keyframes: {
				fadeIn: {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
			},
		},
	},
	plugins: [],
};
