import db from '../src/config/database.ts';
import http from 'http';
import fs from 'fs/promises';

import '../index.ts';

import * as tagModel from '../src/models/tagModel.ts';
import * as historyModel from '../src/models/historyModel.ts';

console.log("Creating tags:");

await tagModel.ensureTag("10:00:00:00:00:00", "Vessa");
await tagModel.ensureTag("20:00:00:00:00:00", "Olohuone");
await tagModel.ensureTag("30:00:00:00:00:00");

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
		humidity: 73.11,
		battery_low: false
	}
);

await historyModel.saveHistory(
	{
		ruuvi_id: 2,
		datetime: "2020-02-02T02:02:04+02:00",
		temperature: 17.30,
		humidity: 80.13,
		battery_low: false
	}
);

await historyModel.saveHistory(
	{
		ruuvi_id: 2,
		datetime: "2020-02-01T02:02:04+02:00",
		temperature: 1.50,
		humidity: 100,
		battery_low: false
	}
);

await historyModel.saveHistory(
	{
		ruuvi_id: 2,
		datetime: "2020-02-02T23:59:04+02:00",
		temperature: 1.50,
		humidity: 100,
		battery_low: true
	}
);

await historyModel.saveHistory(
	{
		ruuvi_id: 3,
		datetime: "2019-03-01T02:02:04+02:00",
		temperature: 25.03,
		humidity: 1.15151,
		battery_low: false
	}
);

try {
	console.log(await historyModel.getHistory());
}
catch (error) {
	console.error(error);
}


console.log("Only 2020-02-02");
console.log(await historyModel.getHistory("2020-02-02"));

const url = 'http://localhost:8080';

await fetch(url + '/history')
	.then(response => response.json())
	.then(data => console.log(data))
	.catch(error => console.error('Error:', error)
);

// Read GW data files.
const ruuviGwPayload = await fs.readFile('./test/ruuvi-gateway.json', 'utf-8');
const ruuviGwPayloadWizard = await fs.readFile('./test/ruuvi-gateway-wizard.json', 'utf-8');

// Send a POST request
const gwResponse = await fetch(url + "/history", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: ruuviGwPayload
});

console.log(await gwResponse.json());

// Send a POST request
const gwResponseWizard = await fetch(url + "/history", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: ruuviGwPayloadWizard
});

console.log(await gwResponseWizard.json());

await fetch(url + "/history")
	.then(response => response.json())
	.then(data => console.log(data))
	.catch(error => console.error('Error:', error)
);

process.exit();