import dataStore from 'nedb';
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";
import { loadExportations } from './exportations-stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let db = new dataStore();

export function loadBackend(app){
//CLAUDIA PAEZ SOLLO (Exportations-stats)
loadExportations(app);
}
