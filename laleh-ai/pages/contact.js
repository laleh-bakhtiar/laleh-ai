import Script from 'next/script';
import { useEffect } from 'react';
import LegacyHead from '../components/LegacyHead';
import { loadLegacyBody } from '../lib/loadLegacyBody';
import { legacyTypographyCss } from '../lib/legacyStyles';

export default function Contact({ bodyContent }) {
	useEffect(() => {
		const classes = ['no-header-page', 'wsite-theme-light', 'wsite-page-contact'];
		document.body.classList.add(...classes);
		return () => {
			document.body.classList.remove(...classes);
		};
	}, []);

	return (
		<>
			<LegacyHead
				title="Contact - Laleh Bakhtiar"
				ogDescription="Web Design by MIS, Inc."
			>
				<meta property="og:title" content="Contact" />
				<meta property="og:image" content="/uploads/1/2/5/2/125200189/tulip-a_orig.png" />
				<meta property="og:image" content="https://www.lalehbakhtiar.com/uploads/1/2/5/2/125200189/published/laleh-logo.png?1634332399" />
				<meta property="og:url" content="https://www.lalehbakhtiar.com/contact.html" />
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
	const bodyContent = await loadLegacyBody('contact.html');

	return {
		props: {
			bodyContent,
		},
	};
}
