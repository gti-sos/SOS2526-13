import express from 'express';
import bodyParser from 'body-parser';
import path from "path"

import {loadBackend} from './src/back/index.js';
import  {backendPMA}  from './src/back/conflict-stats.js';
import {loadMilitaryStats} from './src/back/military-stats.js';

import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();

let port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("public"));
app.use(express.json());

backendPMA(app);
loadBackend(app);
loadMilitaryStats(app);

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.listen(port, () => {

    console.log(`server running on http://localhost:${port}`)
});