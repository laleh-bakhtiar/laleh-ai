// pages/_app.js
import '../styles/globals.css';
import Navigation from '../components/Navigation';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
	const router = useRouter();
	const HIDE_NAV_PATHS = ['/chat', '/laleh-ai'];
	const showNavigation = !HIDE_NAV_PATHS.includes(router.pathname);

	return (
		<>
			{showNavigation && <Navigation />}
			<Component {...pageProps} />
		</>
	);
}
