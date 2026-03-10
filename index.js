//let cool = require('cool-ascii-faces');
import express from 'express';
import path from 'path';
import {loadBackend} from './src/back/index.js';

import { fileURLToPath } from "url";
import { dirname } from "path";

//const path = require('path');
const app = express();

let port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Rutas cool y about

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

loadBackend(app);

app.listen(port, () => {

    console.log(`server running on http://localhost:${port}`)
});