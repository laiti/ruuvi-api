import knex from 'knex';

const config = {
	client: 'mysql2',
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
	},
};

if (process.env.NODE_ENV === 'test') {
	config.client = 'sqlite3';
	config.connection = { filename: ':memory:' };
	config.useNullAsDefault = true;
}

// This will make sure the field "datetime" will be always returned in ISO format.
config.postProcessResponse = (result) => {
	const normalize = (row) => {
				if (typeof row !== 'object' || row === null) return row;

				// Only modify 'datetime' if the row actually has it
				if ('datetime' in row && row.datetime !== null) {
					return { ...row, datetime: new Date(row.datetime) };
				}
			
				return row;
			};

			return Array.isArray(result) ? result.map(normalize) : normalize(result);
		};

const db = knex(config);

// Dummy database for testing.
if (process.env.NODE_ENV === 'test') {
	await db.schema.createTable('tag', table => {
		table.increments('id');
		table.string('ruuvi_id');
		table.string('name')
	});

	await db.schema.createTable('history', table => {
		table.increments('id');
		table.integer('tag_id');
		table.dateTime('datetime').notNullable();
		table.float('temperature');
		table.float('humidity');
	});
}

export default db;
