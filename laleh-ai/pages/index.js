import Script from 'next/script';
import { useEffect } from 'react';
import LegacyHead from '../components/LegacyHead';
import { loadLegacyBody } from '../lib/loadLegacyBody';
import { legacyTypographyCss } from '../lib/legacyStyles';

export default function Home({ bodyContent }) {
	useEffect(() => {
		const classes = ['no-header-page', 'wsite-theme-light', 'wsite-page-index'];
		document.body.classList.add(...classes);
		return () => {
			document.body.classList.remove(...classes);
		};
	}, []);

	return (
		<>
			<LegacyHead
				title="Laleh Bakhtiar - Islamic Book Author, Editor and Translator"
				description="Dr. Laleh Bakhtiar is a renowned Islamic Author, Editor and Translator, including the Sublime Quran, The Sufi Enneagram and more."
				ogDescription="Dr. Laleh Bakhtiar is a renowned Islamic Author, Editor and Translator, including the Sublime Quran, The Sufi Enneagram and more."
			>
				<meta property="og:title" content="Islamic Book Author, Editor and Translator" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/cleanshot-2024-03-01-at-17-18-35-2x_orig.png" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/camelia-clean_3.png" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/tulip-b_orig.png" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/crown-flowered-protea_orig.png" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/editor/washington-post-logo%EF%B9%961636581188.png" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/editor/religion-news-service-logo%EF%B9%961636581185.png" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/camelia-clean_1.png" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/published/laleh-logo%EF%B9%961634332399.png" />
				<meta property="og:url" content="https://www.lalehbakhtiar.com/" />
				<style>{`${legacyTypographyCss}
					.wsite-background-17 .wsite-content-title:first-of-type {
						font-family: 'Crimson Text', serif !important;
						font-size: 22px !important;
						letter-spacing: 0.25em !important;
						color: #d5d5d5 !important;
						margin-bottom: 20px !important;
					}

					.wsite-background-17 .wsite-content-title:last-of-type {
						font-family: 'Cardo', serif !important;
						font-size: 64px !important;
						line-height: 1.15 !important;
						color: #ffffff !important;
						letter-spacing: 0.03em !important;
						margin-bottom: 0 !important;
					}
				`}</style>
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
	const bodyContent = await loadLegacyBody('index.html');

	return {
		props: {
			bodyContent,
		},
	};
}
