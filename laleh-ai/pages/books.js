import Script from 'next/script';
import { useEffect } from 'react';
import LegacyHead from '../components/LegacyHead';
import { loadLegacyBody } from '../lib/loadLegacyBody';
import { legacyTypographyCss } from '../lib/legacyStyles';

export default function Books({ bodyContent }) {
	useEffect(() => {
		const classes = ['no-header-page', 'wsite-theme-light', 'wsite-page-books'];
		document.body.classList.add(...classes);
		return () => {
			document.body.classList.remove(...classes);
		};
	}, []);

	return (
		<>
			<LegacyHead
				title="Islamic Book Author, Editor and Translator - Laleh Bakhtiar"
				description="Dr. Laleh Bakhtiar is a renowned Islamic Author, Editor and Translator, including the Sublime Quran, The Sufi Enneagram and more."
				ogDescription="Dr. Laleh Bakhtiar is a renowned Islamic Author, Editor and Translator, including the Sublime Quran, The Sufi Enneagram and more."
			>
				<meta property="og:title" content="Islamic Book Author, Editor and Translator" />
				<meta property="og:image" content="https://images-na.ssl-images-amazon.com/images/I/51UqbF4a-sL._SL160_.jpg" />
				<meta property="og:image" content="https://images-na.ssl-images-amazon.com/images/I/41fVcOedhkL._SL160_.jpg" />
				<meta property="og:image" content="https://images-na.ssl-images-amazon.com/images/I/5105IVF-HOL._SL160_.jpg" />
				<meta property="og:image" content="https://images-na.ssl-images-amazon.com/images/I/51THDtlpsPL._SL160_.jpg" />
				<meta property="og:image" content="https://images-na.ssl-images-amazon.com/images/I/51tNV3JsqFL._SL160_.jpg" />
				<meta property="og:image" content="https://images-na.ssl-images-amazon.com/images/I/61DFRyhX5gL._SL160_.jpg" />
				<meta property="og:image" content="https://images-na.ssl-images-amazon.com/images/I/41hMOR0g2YL._SL160_.jpg" />
				<meta property="og:image" content="https://images-na.ssl-images-amazon.com/images/I/415CpUUmsLL._SL160_.jpg" />
				<meta property="og:image" content="https://images-na.ssl-images-amazon.com/images/I/71Q717K176L._SL160_.gif" />
				<meta property="og:image" content="https://images-na.ssl-images-amazon.com/images/I/51Oi0MeqjoL._SL160_.jpg" />
				<meta property="og:url" content="https://www.lalehbakhtiar.com/books.html" />
				<style>{legacyTypographyCss}</style>
			</LegacyHead>
			<div dangerouslySetInnerHTML={{ __html: bodyContent }} />
			<Script src="https://cdn2.editmysite.com/js/jquery-1.8.3.min.js" strategy="beforeInteractive" />
			<Script src="/files/theme/plugins%EF%B9%961667001156.js" strategy="afterInteractive" />
			<Script src="/files/theme/custom%EF%B9%961667001156.js" strategy="afterInteractive" />
			<Script src="https://donorbox.org/widget.js" strategy="lazyOnload" />
		</>
	);
}

export async function getStaticProps() {
	const bodyContent = await loadLegacyBody('books.html');

	return {
		props: {
			bodyContent,
		},
	};
}
