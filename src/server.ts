import express from 'express';
import { saveHistory, getHistory, getCurrentHistory } from './models/historyModel.ts';

import * as dotenv from 'dotenv';
dotenv.config();

const app: object = express();
const PORT: number = process.env.SERVER_PORT;

app.use(express.json());

// POST /history - Save history data
app.post('/history', async (req, res) => {
	try {
		const { format } = req.query;
		
		let historyEntries = [];

		switch (format) {
			case 'ruuvi-gateway': {
				const tags = req.body?.data?.tags;
				
				if (!tags || typeof tags !== 'object') {
					return res.status(400).json({ error: 'Invalid ruuvi-gateway payload' });
				}

				historyEntries = Object.values(tags).map(tag => ({
					ruuvi_id: tag.id,
					datetime: new Date(tag.timestamp * 1000).toISOString(),
					temperature: tag.temperature,
					humidity: tag.humidity,
				}));
				break;
			}
			default: {
				const { ruuvi_id, datetime, temperature, humidity } = req.body;
				
				if (!ruuvi_id || !datetime || !temperature || !humidity || !voltage) {
					return res.status(400).json({ error: 'Missing required fields' });
				}
				historyEntries = [{ ruuvi_id, datetime, temperature, humidity, voltage }];
			}
		}

		if (!historyEntries.length) {
			return res.status(400).json({ error: 'No valid history entries' });
		}

		// Save each history entry
		await Promise.all(historyEntries.map(entry => saveHistory(entry)));

		res.status(201).json({ message: 'Data inserted successfully' });
	}
	catch (error) {
		next(error);
	}
});

// GET /history - Fetch history data
app.get('/history', async (req, res, next) => {
	try {
		const records = await getHistory();
		res.json(records);
	}
	catch (error) {
		next(error);
	}
});

// GET /current - Fetch latest history data
app.get('/current', async (req, res, next) => {
	try {
		const records = await getCurrentHistory();
		res.json(records);
	}
	catch (error) {
		next(error);
	}
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500);
	res.json({ error: "Something went wrong." });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});