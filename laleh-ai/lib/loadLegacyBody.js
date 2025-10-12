import path from 'path';
import { promises as fs } from 'fs';

const linkMap = {
	'index.html': '/',
	'dr-laleh-bakhtiar.html': '/dr-laleh-bakhtiar',
	'abol-toos.html': '/abol-toos',
	'cyrus-toos.html': '/cyrus-toos',
	'helen-toos.html': '/helen-toos',
	'laleh-ai.html': '/laleh-ai',
	'books.html': '/books',
	'laleh-knowledge-lake.html': '/laleh-knowledge-lake',
	'institute.html': '/institute',
	'contact.html': '/contact',
	'_downloads.html': '/downloads',
};

export async function loadLegacyBody(filename) {
	const filePath = path.join(process.cwd(), 'website-pages', filename);
	const html = await fs.readFile(filePath, 'utf8');

	const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
	let bodyContent = bodyMatch ? bodyMatch[1] : '';

	const removeLegacySection = (content, classFragment) => {
		const marker = `<div class="${classFragment}"`;
		const start = content.indexOf(marker);
		if (start === -1) return content;

		const divRegex = /<\/?div\b[^>]*>/gi;
		divRegex.lastIndex = start;
		let depth = 0;
		let match;

		while ((match = divRegex.exec(content))) {
			if (match.index < start) {
				continue;
			}

			if (match[0].startsWith('</')) {
				depth -= 1;
				if (depth === 0) {
					const end = divRegex.lastIndex;
					return content.slice(0, start) + content.slice(end);
				}
			} else {
				depth += 1;
			}
		}

		return content;
	};

	bodyContent = removeLegacySection(bodyContent, 'cento-header');
	bodyContent = removeLegacySection(bodyContent, 'nav mobile-nav');

	bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');

	for (const [from, to] of Object.entries(linkMap)) {
		const regex = new RegExp(`href="${from}"`, 'g');
		bodyContent = bodyContent.replace(regex, `href="${to}"`);
	}

	bodyContent = bodyContent.replace(/(src|href)="uploads\//g, '$1="/uploads/');
	bodyContent = bodyContent.replace(/(src|href)="files\//g, '$1="/files/');

	return bodyContent;
}
