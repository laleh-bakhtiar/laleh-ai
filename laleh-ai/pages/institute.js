import Script from 'next/script';
import { useEffect } from 'react';
import LegacyHead from '../components/LegacyHead';
import { loadLegacyBody } from '../lib/loadLegacyBody';
import { legacyTypographyCss } from '../lib/legacyStyles';

export default function Institute({ bodyContent }) {
	useEffect(() => {
		const classes = ['no-header-page', 'wsite-theme-light', 'wsite-page-institute'];
		document.body.classList.add(...classes);
		return () => {
			document.body.classList.remove(...classes);
		};
	}, []);

	return (
		<>
			<LegacyHead
				title="Institute of Traditional Psychoethics &amp; Guidance - Laleh Bakhtiar"
				ogDescription="To bring Laleh's wisdom to life as an online knowledge base, we are raising much needed funds that will pay for data scientists to synthesize the thousands of data points in Dr. Bakhtiar’s research..."
			>
				<meta property="og:title" content="Institute of Traditional Psychoethics &amp; Guidance" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/camelia-clean_2.png" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/karim-ardalan-ivow-2_orig.jpg" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/mani-farhadi-headshot_orig.png" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/davar-photo-copy2_orig.jpg" />
				<meta property="og:image" content="https://www.lalehbakhtiar.com/uploads/1/2/5/2/125200189/published/laleh-logo.png?1634332399" />
				<meta property="og:url" content="https://www.lalehbakhtiar.com/institute.html" />
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
	const bodyContent = await loadLegacyBody('institute.html');

	return {
		props: {
			bodyContent,
		},
	};
}
