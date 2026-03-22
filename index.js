import express from 'express';
import bodyParser from 'body-parser';
import path from "path"
import cors from 'cors';
import {handler} from './src/front/build/handler.js';

import {loadExportations} from './src/back/exportations-stats.js';
import  {backendPMA_v1}  from './src/back/conflict-stats-v1.js';
import  {backendPMA}  from './src/back/conflict-stats.js';
import {loadMilitaryStats} from './src/back/military-stats.js';

import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());


let port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//app.use(express.static("public"));
app.use(express.json());

backendPMA(app)
backendPMA_v1(app);
loadExportations(app);
loadMilitaryStats(app);

app.use(handler);

app.listen(port, () => {

    console.log(`server running on http://localhost:${port}`)
});