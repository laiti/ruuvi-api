import express from 'express';
import { historyGet, historyPost, currentGet } from './controllers/historyController.ts';
import * as dotenv from 'dotenv';
dotenv.config();

const app: object = express();
const PORT: number = process.env.SERVER_PORT;

app.use(express.json());

app.get('/history', (req, res) => {
	historyGet(req, res);
});

app.get('/current', (req, res) => {
	currentGet(req, res);
});

app.post('/history', (req, res) => {
	historyPost(req, res);
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
