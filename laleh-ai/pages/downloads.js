import LegacyHead from '../components/LegacyHead';
import { loadLegacyBody } from '../lib/loadLegacyBody';

export default function Downloads({ bodyContent }) {
	return (
		<>
			<LegacyHead title="Downloads - Laleh Bakhtiar">
				<meta charSet="UTF-8" />
			</LegacyHead>
			<div dangerouslySetInnerHTML={{ __html: bodyContent }} />
		</>
	);
}

export async function getStaticProps() {
	const bodyContent = await loadLegacyBody('_downloads.html');

	return {
		props: {
			bodyContent,
		},
	};
}
