import multiparty from 'multiparty';
import fs from 'fs';
import { promisify } from 'util';
import openai from '../../lib/openai';

export const config = {
	api: { bodyParser: false },
};

const readFile = promisify(fs.readFile);

export default async function handler(req, res) {
	const form = new multiparty.Form();

	form.parse(req, async (err, fields, files) => {
		if (err) return res.status(500).json({ error: 'Upload error' });

		const file = files.file[0];
		const buffer = await readFile(file.path);

		const fileUpload = await openai.files.create({
			file: buffer,
			purpose: 'assistants',
		});

		await openai.beta.vectorStores.files.create(process.env.VECTOR_STORE_ID, {
			file_id: fileUpload.id,
		});

		res.status(200).json({ message: 'File uploaded to vector store' });
	});
}
