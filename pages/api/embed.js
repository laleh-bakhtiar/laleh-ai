import pdf from 'pdf-parse';
import multiparty from 'multiparty';
import fs from 'fs';
import { promisify } from 'util';
import { getEmbedding } from '../../lib/utils';
import supabase from '../../lib/supabase';

export const config = {
	api: {
		bodyParser: false,
	},
};

const readFile = promisify(fs.readFile);

function smartChunk(text, maxTokens = 1000) {
	const paragraphs = text.split(/\n\s*\n/); // split by paragraph
	const chunks = [];
	let current = '';

	for (const para of paragraphs) {
		if ((current + para).length > maxTokens) {
			chunks.push(current.trim());
			current = para;
		} else {
			current += '\n\n' + para;
		}
	}

	if (current) chunks.push(current.trim());
	return chunks;
}

export default async function handler(req, res) {
	const form = new multiparty.Form();

	form.parse(req, async (err, fields, files) => {
		if (err) return res.status(500).json({ error: 'Error parsing file upload.' });

		const file = files.file[0];
		const buffer = await readFile(file.path);
		const data = await pdf(buffer);
		const text = data.text;

		const chunks = smartChunk(text);

		for (let i = 0; i < chunks.length; i++) {
			const chunk = chunks[i];
			const embedding = await getEmbedding(chunk);

			await supabase.from('documents').insert({
				content: chunk,
				embedding,
				filename: file.originalFilename,
				chunk_index: i,
			});

			console.log(`Embedded chunk ${i + 1} of ${chunks.length}`);
		}

		return res.status(200).json({ message: 'PDF embedded successfully.' });
	});
}
