import dataStore from "nedb";

let db = new dataStore({ filename: 'military-stats.db', autoload: true });

let BASE_API_URL = "/api/v1/military-stats";

export function loadMilitaryStats(app) {

    const initialData = [
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

    app.get(BASE_API_URL + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/52632390/2sBXigNECE");
    });

    // LOAD INITIAL DATA
    app.get(BASE_API_URL + "/loadInitialData", (req, res) => {
        db.count({}, (err, count) => {
            if (count === 0) {
                db.insert(initialData, () => {
                    console.log("Datos iniciales cargados");
                    res.sendStatus(201);
                });
            } else {
                res.sendStatus(409);
            }
        });
    });


    app.get(BASE_API_URL, (req, res) => {
        let query = {};

        // --- 1. FILTROS DINÁMICOS ---
        // Filtro por país 
        if (req.query.country) {
            query.country = req.query.country;
        }

        // Filtro por año 
        if (req.query.year) {
            query.year = parseInt(req.query.year);
        }

        // Filtro por gasto mayor
        if (req.query.milex_total) {
            query.milex_total = { $gte: parseFloat(req.query.milex_total) };
        }
         if (req.query.milex_gdp) {
            query.milex_gdp = { $gte: parseFloat(req.query.milex_gdp) };
        }
         if (req.query.milex_per_capita) {
            query.milex_per_capita = { $gte: parseFloat(req.query.milex_per_capita) };
        }

        // --- 2. PAGINACIÓN ---
        let offset = Number(req.query.offset);
        let limit = Number(req.query.limit);

        if (offset) {
            result = result.slice(offset);
        }

        if (limit) {
        result = result.slice(0, limit);
      }

        // --- 3. CONSULTA A LA BASE DE DATOS ---
        db.find(query)
            .skip(offset)
            .limit(limit)
            .exec((err, docs) => {
                if (err) {
                    return res.sendStatus(500);
                }

                const result = docs.map(d => {
                    delete d._id;
                    return d;
                });

                res.json(result);
            });
    });

    // --- GET POR AÑO ---
    app.get(BASE_API_URL + "/:country/:year", (req, res) => {

        const country = req.params.country;
        const year = parseInt(req.params.year);

        if (isNaN(year)) {
            return res.sendStatus(400);
        }

        db.findOne({ country: country, year: year }, (err, doc) => {

            if (err) return res.sendStatus(500);

            if (!doc) return res.sendStatus(404);

            delete doc._id;

            res.json(doc);
        });

    });

    // POST
    app.post(BASE_API_URL, (req, res) => {
        const newData = req.body;
        // Validación 400
        if (!newData.country || !newData.year || newData.milex_total === undefined || newData.milex_gdp === undefined || newData.milex_per_capita === undefined) {
            return res.status(400).send("Faltan campos obligatorios");
        }
        // Validación 409 (Existe)
        db.findOne({ country: newData.country, year: parseInt(newData.year) }, (err, doc) => {
            if (doc) {
                res.status(409).send("El recurso ya existe");
            } else {
                db.insert(newData, (err, newDoc) => {
                    res.sendStatus(201);
                });
            }
        });
    });

    // PUT RECURSO CONCRETO
    app.put(BASE_API_URL + "/:country/:year", (req, res) => {
        const { country, year } = req.params;
        const body = req.body;

        // Validación 400: El ID de la URL debe coincidir con el del Body
        if (country !== body.country || parseInt(year) !== parseInt(body.year)) {
            return res.status(400).send("ID del recurso no coincide con el cuerpo");
        }

        db.update({ country: country, year: parseInt(year) }, body, {}, (err, numReplaced) => {
            if (numReplaced > 0) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        });
    });

    // DELETE RECURSO
    app.delete(BASE_API_URL + "/:country/:year", (req, res) => {
        const { country, year } = req.params;
        db.remove({ country: country, year: parseInt(year) }, {}, (err, numRemoved) => {
            if (numRemoved > 0) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        });
    });

    // DELETE COLECCIÓN
    app.delete(BASE_API_URL, (req, res) => {
        db.remove({}, { multi: true }, (err, numRemoved) => {
            res.sendStatus(200);
        });
    });

    // MÉTODOS NO PERMITIDOS (405)
    app.put(BASE_API_URL, (req, res) => res.sendStatus(405));
    app.post(BASE_API_URL + "/:country/:year", (req, res) => res.sendStatus(405));
}