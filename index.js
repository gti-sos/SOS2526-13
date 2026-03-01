let cool = require('cool-ascii-faces');
let express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/cool',(req, res) =>{
    res.send(cool())
} )

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

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


let milex_datos = [];
const BASE_API_URL = "/api/v1/military-stats";

app.get(BASE_API_URL + "/loadInitialData", (req, res) => {
    if (milex_data.length === 0) {
        milex_data = [
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

app.get(BASE_API_URL, (req, res) => {
    res.json(milex_data);
});

app.post(BASE_API_URL, (req, res) => {
    let newData = req.body;
    if (milex_data.find(d => d.country === newData.country && d.year === newData.year)) {
        res.sendStatus(409);
    } else {
        milex_data.push(newData);
        res.sendStatus(201);
    }
});

app.delete(BASE_API_URL, (req, res) => {
    milex_data = [];
    res.sendStatus(200);
});

app.listen(port, () => {

    console.log(`server running on http://localhost:${port}`)
})
