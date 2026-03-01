let cool = require('cool-ascii-faces');
let express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/cool',(req, res) =>{
    res.send(cool())
} )

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});


//Algoritmo Camila España Vildoso 

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
})
