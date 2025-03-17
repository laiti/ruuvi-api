import db from '../config/database.ts';

export async function getTags(): Promise<object[]> {
	const tags: object[] = await db('tag');
	
	return tags;
}

export async function getTagById(id: number): Promise<object> {
	const tag: object = await db('tag').where({ id: id }).first();
	
	return tag;
}

export async function getTagByRuuviId(ruuvi_id: string): Promise<object> {
	const tag: object = await db('tag').where({ ruuvi_id: ruuvi_id }).first();
	
	return tag;
}

export async function insertTag(ruuvi_id: string, name: string = null): Promise<number> {
	const [ id ]: number = await db('tag').insert({ ruuvi_id: ruuvi_id, name: name });
	
	return id;
}

export async function ensureTag(ruuvi_id: string, name: string = null): Promise<object> {
	let tag: object = await getTagByRuuviId(ruuvi_id);
	
	// Check if the tag already exists. If not, create it.
	if (!tag) {
		try {
			// Create and load the tag.
			let tag_id: number = await insertTag(ruuvi_id, name);
			tag = await getTagById(tag_id);
		}
		catch (error) {
			throw error;
		}
	}
	
	// Return existing tag or newly reated one.
	return tag;
}