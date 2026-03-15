//let cool = require('cool-ascii-faces');
import express from 'express';
import bodyParser from 'body-parser';
import {loadBackend} from './src/back/index.js';
import  {backendPMA}  from './src/back/conflict-stats.js';

import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();

let port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Rutas cool y about

app.use(express.static("public"));
app.use(express.json());

backendPMA(app);

loadBackend(app);

app.listen(port, () => {

    console.log(`server running on http://localhost:${port}`)
});