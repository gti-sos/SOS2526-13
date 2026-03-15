import dataStore from 'nedb';
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";
import { loadExportations } from './exportations-stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let db = new dataStore();

export function loadBackend(app){

//app.get('/cool',(req, res) =>{
//    res.send(cool())
//} )

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});


//Ruta para /samples/CEV

app.get('/samples/CEV', (req, res) =>{
    const datosMilex =[
    { country : "Poland", year :2010, milex_total :19710.8, milex_gdp :1.84, milex_per_capita :231.2},
    { country : "Poland", year :2020, milex_total : 17431.8, milex_gdp :2.26, milex_per_capita :358.9},
    { country : "Morocco", year :2010, milex_total :3160.8, milex_gdp :3.39, milex_per_capita :98},
    { country : "Morocco", year :2022, milex_total :4995, milex_gdp :3.81, milex_per_capita :132.7},
    { country : "Cuba", year :2015, milex_total :118.4, milex_gdp :3.08, milex_per_capita :10.5},
    { country : "Cuba", year :2018, milex_total :128.6, milex_gdp :2.88, milex_per_capita :11.4},
    { country : "Australia", year :2015, milex_total :24046.2, milex_gdp :1.95, milex_per_capita :1011.7},
    { country : "Australia", year :2022, milex_total :32445.3, milex_gdp :1.88, milex_per_capita :1244},
    { country :"China", year :2010, milex_total :0, milex_gdp :1.73, milex_per_capita :78.3},
    { country :"China", year : 2018, milex_total :1604.4, milex_gdp :1.67, milex_per_capita :164.2}
    ];
    let morocco = datosMilex.filter(p => p.country === "Morocco");
    let media_milex_total = morocco.reduce((acum, i) => acum + i.milex_total, 0) / morocco.length;

    res.send(`La media del milex total de Marruecos es de: ${media_milex_total}`);

});

//CLAUDIA PAEZ SOLLO (Exportations-stats)
loadExportations(app);


// API RESTful para Military Expenditure (Milex)
let milex_datos = [];
const BASE_API_URL = "/api/v1/military-stats";

app.get(BASE_API_URL + "/loadInitialData", (req, res) => {
    if (milex_datos.length === 0) {
        milex_datos = [
            { country: "poland", year: 2010, milex_total: 19710.8, milex_gdp: 1.84, milex_per_capita: 231.2 },
            { country: "morocco", year: 2022, milex_total: 4995, milex_gdp: 3.81, milex_per_capita: 132.7 },
            { country: "cuba", year: 2015, milex_total: 118.4, milex_gdp: 3.08, milex_per_capita: 10.5 },
            { country: "australia", year: 2015, milex_total: 24046.2, milex_gdp: 1.95, milex_per_capita: 1011.7 },
            { country: "china", year: 2010, milex_total: 0, milex_gdp: 1.73, milex_per_capita: 78.3 },
            { country: "poland", year: 2020, milex_total: 17431.8, milex_gdp: 2.26, milex_per_capita: 358.9 },
            { country: "morocco", year: 2010, milex_total: 3160.8, milex_gdp: 3.39, milex_per_capita: 98 },
            { country: "cuba", year: 2018, milex_total: 128.6, milex_gdp: 2.88, milex_per_capita: 11.4 },
            { country: "australia", year: 2022, milex_total: 32445.3, milex_gdp: 1.88, milex_per_capita: 1244 },
            { country: "china", year: 2018, milex_total: 1604.4, milex_gdp: 1.67, milex_per_capita: 164.2 }
        ];
        res.sendStatus(201);
    } else {
        res.status(400).send("El array ya tiene datos");
    }
});

//GET, POST y PUT para /api/v1/military-stats

//GET
app.get(BASE_API_URL, (req, res) => {
    res.status(200).json(milex_datos);
});


//GET array completo
app.get(BASE_API_URL, (req, res) => {
    const { country, year, from, to } = req.query; 
    let filteredData = milex_datos;

    if (country) {
        filteredData = filteredData.filter(d => d.country === country);
    }
    if (year) {
        filteredData = filteredData.filter(d => d.year == year);
    }
    if (from && to) {
        filteredData = filteredData.filter(d => d.year >= parseInt(from) && d.year <= parseInt(to));
    }

    res.json(filteredData); 
});

//GET recurso concreto
app.get(BASE_API_URL + "/:country/:year", (req, res) => {
    const {country ,year} = req.params;
    const resource = milex_datos.find(d => d.country === country && d.year == year);
    if(resource){
        res.status(200).json(resource);
    }else{
        res.status(404).send("Recurso no encontrado");
    }
});


// POST nuevo recurso

app.post(BASE_API_URL + "/:country/:year", (req, res) => {
    res.sendStatus(405);
});

app.post(BASE_API_URL, (req, res) => {
    let newData = req.body;
    if(!newData.country || !newData.year || newData.milex_total === undefined || newData.milex_gdp === undefined || newData.milex_per_capita === undefined){
        res.status(400).send("Faltan campos obligatorios o están mal formados");
    } 

    const exists = milex_datos.find(d => d.country.toLowerCase() === newData.country.toLowerCase() && d.year == newData.year);
    if(exists){
        res.status(409).send("El recurso ya existe");
    } else {
        milex_datos.push(newData);
        res.sendStatus(201);
    }
});
//POST no permitido para recurso concreto
app.post(BASE_API_URL + "/:country/:year", (req, res) => {
    res.status(405).send("No se permite POST en un recurso concreto");
});


//PUT no permitido para la colección
app.put(BASE_API_URL, (req, res) => {
    res.status(405).send("No se permite PUT en la colección");
});


// PUT para actualizar recurso existente
app.put(BASE_API_URL + "/:country/:year", (req, res) => {
    const {country ,year} = req.params;
    const updatedData = req.body; 
    
    if(country !== updatedData.country || year != updatedData.year){
        return res.status(400).send("El país y el año en la URL deben coincidir con los del cuerpo de la solicitud");
    }

    const index = milex_datos.findIndex(d => d.country === country && d.year == year);
    if(index !== -1){
        milex_datos[index] = updatedData;
        res.sendStatus(200);
    }else{
        res.status(404).send("El recurso que se desea actualizar no existe");
    }
});

//DELETE para eliminar recurso concreto
app.delete(BASE_API_URL + "/:country/:year", (req, res) => {
    const { country, year } = req.params;
    const exists = milex_datos.find(d => d.country === country && d.year == year);

    if (exists) {
        milex_datos = milex_datos.filter(d => {
            return d.country !== country || d.year != year;
        });
        res.sendStatus(200); 
    } else {
        res.status(404).send("No existe el recurso que intentas borrar no existe");
    }
});

//DELETE para eliminar todos los recursos
    app.delete(BASE_API_URL, (req, res) => {
    milex_datos = []; 
    res.status(200).send("Se han borrado todos los datos de la lista");
});

}
