import Datastore from "nedb";
const db = new Datastore({ filename: "conflict-stats.db", autoload: true });

// --- Función para comprobar json de entrada ---
function isValidConflict(c) {
    return c.location &&
        c.year &&
        c.intensity_level !== undefined &&
        c.conflict_type !== undefined &&
        c.start_precision !== undefined;
}

export function backendPMA(app) {
    // --- DATOS ---
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

    // --- Calculo de la media por pais ---
    app.get('/samples/PMA', (req, res) => {

        let egypt = datosPablo.filter(l => l.location === "Egypt, Israel");

        let media_intensityLevel = egypt.reduce((acc, l) => acc + l.intensity_level, 0) / egypt.length;

        res.send(`The average intensity level on Egypt conflicts is ${media_intensityLevel}`)
    })

    // --- COPIA DE TRABAJO ---
    //let dataConflicts = [];

    // --- CARGA INICIAL ---

    /* app.get("/api/v1/conflict-stats/loadInitialData", (req, res) => {
    if (dataConflicts.length === 0) {
        dataConflicts = datosPablo.slice();
        res.sendStatus(201);
    } else {
        res.sendStatus(409);
    }
    }); */

    app.get("/api/v1/conflict-stats/loadInitialData", (req, res) => {

        db.count({}, (err, count) => {

            if (count === 0) {

                db.insert(datosPablo, () => {
                    res.sendStatus(201);
                });
            } else {
                res.sendStatus(409);
            }
        });

    });


    // --- GET COLECCIÓN ---

    /* app.get("/api/v1/conflict-stats", (req, res) => {

    if (dataConflicts.length === 0) {
        return res.sendStatus(404);
    }

    res.json(dataConflicts);
    }); */

    app.get("/api/v1/conflict-stats", (req, res) => {
        db.find({}, (err, docs) => {

            if (docs.length === 0) {
                return res.sendStatus(404);
            }
            res.json(docs);

        });

    });



    // --- GET POR AÑO ---

    /* app.get("/api/v1/conflict-stats/:year", (req, res) => {
    const year = parseInt(req.params.year);
    const result = dataConflicts.filter(d => d.year === year);

    //compruebo que está en el formato correcto
    if (isNaN(year)) {
    return res.sendStatus(400);
    }

    if (result.length > 0) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
    }); */

    app.get("/api/v1/conflict-stats/:year", (req, res) => {

        const year = parseInt(req.params.year);

        if (isNaN(year)) {
            return res.sendStatus(400);
        }

        db.find({ year: year }, (err, docs) => {

            if (err) {
                return res.sendStatus(500);
            }

            if (docs.length === 0) {
                return res.sendStatus(404);
            }

            res.json(docs);

        });

    });


    // --- POST ---
    app.post("/api/v1/conflict-stats", (req, res) => {

        const newConflict = req.body;

        // JSON incompleto
        if (!isValidConflict(newConflict)) {
            return res.sendStatus(400);
        }

        const exists = dataConflicts.some(c => c.year === newConflict.year);

        if (exists) {
            res.status(409).json({ message: "Conflict already exists" });
        } else {
            dataConflicts.push(newConflict);
            res.status(201).json(newConflict);
        }
    });

    // --- PUT ---
    app.put("/api/v1/conflict-stats/:year", (req, res) => {

        const year = parseInt(req.params.year);
        const index = dataConflicts.findIndex(c => c.year === year);

        // JSON incorrecto
        if (!isValidConflict(req.body)) {
            return res.sendStatus(400);
        }
        // ID distinto al de la URL
        if (req.body.year !== year) {
            return res.sendStatus(400);
        }

        if (index === -1) {
            res.status(404).json({ message: "Not found" });
        } else {
            dataConflicts[index] = req.body;
            res.status(201).json(req.body);
        }
    });

    // --- DELETE DATA ---
    app.delete("/api/v1/conflict-stats", (req, res) => {
        dataConflicts = [];
        res.status(200).json({ message: "All data deleted" });
    });

    // --- DELETE RECURSO CONCRETO ---

    app.delete("/api/v1/conflict-stats/:year", (req, res) => {

        const year = parseInt(req.params.year);
        const initialLength = dataConflicts.length;

        //compruebo que está en el formato correcto
        if (isNaN(year)) {
            return res.sendStatus(400);
        }

        dataConflicts = dataConflicts.filter(c => c.year !== year);

        if (dataConflicts.length < initialLength) {
            res.status(200).json({ message: "Deleted" });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    });

    // --- NO PERMITIDOS ---

    app.post("/api/v1/conflict-stats/:year", (req, res) => {
        res.sendStatus(405);
    });

    app.put("/api/v1/conflict-stats", (req, res) => {
        res.sendStatus(405);
    });

}
