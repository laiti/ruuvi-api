import db from './src/config/database.ts';
import http from 'http';

import './index.ts';

import * as tagModel from './src/models/tagModel.ts';
import * as historyModel from './src/models/historyModel.ts';

console.log("Creating tags:");

console.log(await tagModel.ensureTag("10:00:00:00:00:00", "Vessa"));
console.log(await tagModel.ensureTag("20:00:00:00:00:00", "Olohuone"));
console.log(await tagModel.ensureTag("30:00:00:00:00:00"));

console.log("Getting tags:");

console.log(await tagModel.getTagById(1));
console.log(await tagModel.getTagByRuuviId("20:00:00:00:00:00"));
console.log(await tagModel.getTags());

console.log("Creating history:");

await historyModel.saveHistory(
	{
		ruuvi_id: 1,
		datetime: "2020-02-02T02:02:02+02:00",
		temperature: 15.20,
		humidity: 73.11
	}
);

await historyModel.saveHistory(
	{
		ruuvi_id: 2,
		datetime: "2020-02-02T02:02:04+02:00",
		temperature: 17.30,
		humidity: 80.13
	}
);

await historyModel.saveHistory(
	{
		ruuvi_id: 2,
		datetime: "2020-02-01T02:02:04+02:00",
		temperature: 1.50,
		humidity: 100
	}
);

await historyModel.saveHistory(
	{
		ruuvi_id: 3,
		datetime: "2019-03-01T02:02:04+02:00",
		temperature: 25.03,
		humidity: 1.15151
	}
);

console.log(await historyModel.getHistory());

await fetch('http://localhost:8080/history')
	.then(response => response.json())
	.then(data => console.log(data))
	.catch(error => console.error('Error:', error));

await fetch('http://localhost:8080/current')
	.then(response => response.json())
	.then(data => console.log(data))
	.catch(error => console.error('Error:', error));


process.exit();