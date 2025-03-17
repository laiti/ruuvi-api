import db from '../config/database.ts';
import { saveHistory, getHistory } from '../models/historyModel.ts';

// Handle POST request.
export async function historyPost(req: object, res: object): void {
	try {
		const { ruuvi_id, datetime, temperature, humidity }: object = req.body;
		
		if (!ruuvi_id || !datetime || !temperature || !humidity) {
			return res.status(400).json({ error: 'Missing required fields' });
		}
		
		await saveHistory({ ruuvi_id, datetime, temperature, humidity });
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