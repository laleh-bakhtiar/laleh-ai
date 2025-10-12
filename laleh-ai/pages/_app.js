// pages/_app.js
import '../styles/globals.css';
import { useLegacyNavigation } from '../lib/useLegacyNavigation';

export default function App({ Component, pageProps }) {
 useLegacyNavigation();
 return <Component {...pageProps} />;
}
