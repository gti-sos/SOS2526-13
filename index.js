let cool = require('cool-ascii-faces');
let express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;


//Rutas cool y about

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/cool',(req, res) =>{
    res.send(cool())
} )

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
let cpsData = [];

app.get('/samples/CPS', (req,res) => {
    const cpsData = [
  { recipient: "Afghanistan", supplier: "Russia", year_of_order: 2002, number_ordered: 3, weapon_designation: "Mi-17", weapon_description: "transport helicopter", number_delivered: 3, year_of_delivery: 2002, status: "Second hand", comment: "Second-hand", tiv_unit: 2.9, tiv_total_order: 8.7, tiv_delivered_weapon: 8.7 },
  { recipient: "Algeria", supplier: "Ukraine", year_of_order: 2003, number_ordered: 116, weapon_designation: "R-27R/T", weapon_description: "", number_delivered: 116, year_of_delivery: 2004, status: "New", comment: "New", tiv_unit: 0.19, tiv_total_order: 22.04, tiv_delivered_weapon: 22.04 },
  { recipient: "Angola", supplier: "Cuba", year_of_order: 1975, number_ordered: 1, weapon_designation: "MiG-15UTI", weapon_description: "trainer aircraft", number_delivered: 1, year_of_delivery: 1975, status: "Second hand", comment: "aid", tiv_unit: 1.2, tiv_total_order: 1.2, tiv_delivered_weapon: 1.2 },
  { recipient: "Egypt", supplier: "Spain", year_of_order: 1982, number_ordered: 2, weapon_designation: "Descubierta", weapon_description: "frigate", number_delivered: 2, year_of_delivery: 1984, status: "New", comment: "Partly financed by Saudi Arabia and USA", tiv_unit: 93.7, tiv_total_order: 187.4, tiv_delivered_weapon: 187.4 },
  { recipient: "El Salvador", supplier: "United States", year_of_order: 1969, number_ordered: 3, weapon_designation: "C-47 Skytrain", weapon_description: "transport aircraft", number_delivered: 3, year_of_delivery: 1969, status: "Second hand", comment: "Second-hand", tiv_unit: 1, tiv_total_order: 3, tiv_delivered_weapon: 3 },
  { recipient: "Equatorial Guinea", supplier: "Israel", year_of_order: 2008, number_ordered: 2, weapon_designation: "Saar-4", weapon_description: "patrol boat", number_delivered: 2, year_of_delivery: 2011, status: "New", comment: "", tiv_unit: 22.5, tiv_total_order: 45, tiv_delivered_weapon: 45 },
  { recipient: "Estonia", supplier: "France", year_of_order: 2007, number_ordered: 100, weapon_designation: "Mistral", weapon_description: "portable SAM", number_delivered: 100, year_of_delivery: 2008, status: "New", comment: "Part of EUR60 m deal Mistral-2 version", tiv_unit: 0.09, tiv_total_order: 9, tiv_delivered_weapon: 9 },
  { recipient: "Ethiopia", supplier: "China", year_of_order: 2019, number_ordered: 10, weapon_designation: "BP-12A", weapon_description: "surface-to-surface missile", number_delivered: 10, year_of_delivery: 2020, status: "New", comment: "For A-200 MRL", tiv_unit: 2.25, tiv_total_order: 22.5, tiv_delivered_weapon: 22.5 },
  { recipient: "Greece", supplier: "Germany", year_of_order: 2020, number_ordered: 44, weapon_designation: "DM2A4 Seehecht", weapon_description: "anti-ship/anti-submarine torpedo", number_delivered: 11, year_of_delivery: 2024, status: "New", comment: "EUR110 m deal Seahake Mod-4ER version", tiv_unit: 1.8, tiv_total_order: 79.2, tiv_delivered_weapon: 19.8 },
  { recipient: "Spain", supplier: "Italy", year_of_order: 1975, number_ordered: 14, weapon_designation: "Bell-205A", weapon_description: "helicopter", number_delivered: 14, year_of_delivery: 1977, status: "New", comment: "AB-205 version", tiv_unit: 2.2, tiv_total_order: 30.8, tiv_delivered_weapon: 30.8 }
];
});
const BASE_URL = '/api/v1/cps';



// Devuelve todos los datos de CPS
app.get(BASE_URL, (req, res) => {
  res.json(cpsData);
});

// Filtrar por supplier
app.get(`${BASE_URL}/:supplier`, (req, res) => {
  const supplier = req.params.supplier;
  const filtered = cpsData.filter(d => d.supplier.toLowerCase() === supplier.toLowerCase());
  res.json(filtered);
});

// Load initial data
app.get(`${BASE_URL}/loadInitialData`, (req, res) => {
  if (!cpsData.length) {
    // Aquí puedes crear 10 registros iniciales si quieres
    return res.status(201).json({ message: 'Datos iniciales creados' });
  } else {
    return res.status(200).json(cpsData);
  }
});
// Devuelve todos los datos
app.get(BASE_URL, (req, res) => {
  res.json(cpsData);
});

// Filtrar por supplier
app.get(`${BASE_URL}/:supplier`, (req, res) => {
  const supplier = req.params.supplier;
  const filtered = cpsData.filter(d => d.supplier.toLowerCase() === supplier.toLowerCase());
  res.json(filtered);
});



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
        res.json(resource);
    }else{
        res.status(404).send("Recurso no encontrado");
    }
});


// POST nuevo recurso
app.post(BASE_API_URL, (req, res) => {
    let newData = req.body;
    if(!newData.country || !newData.year || newData.milex_total === undefined || newData.milex_gdp === undefined || newData.milex_per_capita === undefined){
        res.status(400).send("Faltan campos obligatorios o están mal formados");
    } 

    const exists = milex_datos.find(d => d.country.toLowerCase() === newData.country.toLowerCase() && d.year == newData.year);
    if(exists){
        res.sendStatus(409);
    } else {
        milex_datos.push(newData);
        res.sendStatus(201);
    }
});


// PUT para actualizar recurso existente
app.put(BASE_API_URL + "/:country/:year", (req, res) => {
    const {country ,year} = req.params;
    const updatedData = req.body; 
    
    if(country !== updatedData.country || parseInt(year) !== updatedData.year){
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
        res.status(404).send("No existe el recurso que intentas borrar");
    }
});

//DELETE para eliminar todos los recursos
    app.delete(BASE_API_URL, (req, res) => {
    milex_datos = []; 
    res.sendStatus(200);
    console.log("Se han borrado todos los datos de la lista");
});


//Algoritmo Pablo Moraleda Álvarez
app.get('/samples/PMA', (req, res) =>{
const datosPablo = [
  { location: "India", year: 2012, intensity_level: 1, conflict_type: 3, start_precision: 1 },
  { location: "Egypt, Israel", year: 1967, intensity_level: 2, conflict_type: 2, start_precision: 1 },
  { location: "Egypt, Israel", year: 1969, intensity_level: 1, conflict_type: 2, start_precision: 1 },
  { location: "Egypt, Israel", year: 1970, intensity_level: 1, conflict_type: 2, start_precision: 1 },
  { location: "Egypt, Israel", year: 1973, intensity_level: 2, conflict_type: 2, start_precision: 1 },
  { location: "Sudan", year: 2011, intensity_level: 1, conflict_type: 3, start_precision: 1 },
  { location: "South Sudan", year: 2011, intensity_level: 1, conflict_type: 3, start_precision: 2 },
  { location: "South Sudan", year: 2012, intensity_level: 1, conflict_type: 3, start_precision: 2 },
  { location: "South Sudan", year: 2013, intensity_level: 1, conflict_type: 3, start_precision: 2 },
  { location: "South Sudan", year: 2014, intensity_level: 2, conflict_type: 4, start_precision: 2 }
];

let egypt = datosPablo.filter(l => l.location==="Egypt, Israel");

let media_intensityLevel = egypt.reduce((acc, l) => acc + l.intensity_level, 0) / egypt.length;

res.send(`The average intensity level on Egypt conflicts is ${media_intensityLevel}`)

})


app.listen(port, () => {

    console.log(`server running on http://localhost:${port}`)
});