import knex from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
	client: 'mysql2',
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	},
};

if (process.env.NODE_ENV === 'test') {
	config.client = 'sqlite3';
	config.connection = { filename: ':memory:' };
	config.useNullAsDefault = true;
}

// Some fields need post processing. This will go through all rows that are coming from the database.
config.postProcessResponse = (result) => {
	const normalize = (row) => {
		if (typeof row !== 'object' || row === null) return row;

		// Modify datetime to be a date. This is because sqlite stores it as an integer timestamp.
		if ('datetime' in row && row.datetime !== null) {
			row.datetime = new Date(row.datetime);
		}
		
		// Convert battery low from tinyint to boolean because MySQL ynnyms.
		if ('battery_low' in row && row.battery_low !== null) {
			row.battery_low = Boolean(row.battery_low);
		}
	
		return row;
	};

	return Array.isArray(result) ? result.map(normalize) : normalize(result);
};

const db = knex(config);

if (process.env.NODE_ENV === 'test') {
	// Dummy database for testing.
	await db.schema.createTable('tag', table => {
		table.increments('id');
		table.string('ruuvi_id');
		table.string('name');
	});

	await db.schema.createTable('history', table => {
		table.increments('id');
		table.integer('tag_id');
		table.dateTime('datetime').notNullable();
		table.float('temperature');
		table.float('humidity');
		table.boolean('battery_low');
	});
}

export default db;
