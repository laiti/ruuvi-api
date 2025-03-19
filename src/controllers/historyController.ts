import db from '../config/database.ts';
import { saveHistory, getHistory, getCurrentHistory } from '../models/historyModel.ts';

// Handle POST request.
export async function historyPost(req: object, res: object) {
	try {
		const { format }: string = req.query;
		let historyEntries: object[] = [];

		switch (format) {
			case 'ruuvi-gateway': {
				const { tags }: object[] = req.body.data;

				if (!tags || typeof tags !== 'object') {
					return res.status(400).json({ error: 'Invalid ruuvi-gateway payload' });
				}

				historyEntries = Object.values(tags).map(tag => ({
					ruuvi_id: tag.id,
					datetime: new Date(tag.timestamp * 1000).toISOString(),
					temperature: tag.temperature,
					humidity: tag.humidity,
				}));
				
				if (!historyEntries) {
					return res.status(400).json({ error: 'No valid history entries' });
				}
				
				break;
			}
			default: {
				const { ruuvi_id, datetime, temperature, humidity }: object = req.body;

				if (!ruuvi_id || !datetime || !temperature || !humidity) {
					return res.status(400).json({ error: 'Missing required fields' });
				}

				historyEntries = [{ ruuvi_id, datetime, temperature, humidity }];
			}
		}

		// Run all saveHistory calls concurrently
		await Promise.all(historyEntries.map(entry => saveHistory(entry)));

		res.status(201).json({ message: 'Data inserted successfully' });
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// Handle GET request.
export async function historyGet(req: object, res: object): void {
	try {
		const records: object[] = await getHistory();
		res.json(records);
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// Handle GET request.
export async function currentGet(req: object, res: object): void {
	try {
		const records: object[] = await getCurrentHistory();
		res.json(records);
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
};