import db from '../config/database.ts';
import { ensureTag } from '../models/tagModel.ts';

export async function saveHistory({ ruuvi_id, datetime, temperature, humidity }: object): Promise<void> {
	// Datetime is in ISO format.
	datetime = new Date(datetime);
	
	// Get tag ID for Ruuvi MAC.
	const tag_id: number = (await ensureTag(ruuvi_id)).id;
	
	try {
		// Insert into history. Use tag ID here instead of Ruuvi ID.
		await db('history').insert({ tag_id, datetime: datetime, temperature: temperature, humidity: humidity });
	}
	catch (error) {
		throw error;
	}
}

export async function getHistory(): Promise<object> {
	try {
		const history: object[] = await db('history')
			.leftJoin('tag', 'tag.id', 'tag_id')
			.select([ 'history.*', 'tag.name as tag_name' ])
			.orderBy('history.datetime', 'DESC');
			
		return history;
	}
	catch (error) {
		throw error;
	}
}

export async function cleanHistoryOlderThan(days) {
	
}

export async function saveAggregatedHistory() {
	
}