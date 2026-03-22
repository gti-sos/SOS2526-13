import Datastore from "nedb";
const db = new Datastore({ filename: "conflict-stats-v1.db", autoload: true });

// --- Función para comprobar json de entrada ---
function isValidConflict(c) {
    return c.location &&
        c.year &&
        c.intensity_level !== undefined &&
        c.conflict_type !== undefined &&
        c.start_precision !== undefined;
}

export function backendPMA_v1(app) {
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

    app.get("/api/v1/conflict-stats", (req, res) => {

        let query = {};

        // --- FILTROS ---
        if (req.query.location) {
            query.location = req.query.location;
        }

        if (req.query.year) {
            query.year = parseInt(req.query.year);
        }

        if (req.query.intensity_level) {
            query.intensity_level = parseInt(req.query.intensity_level);
        }

        if (req.query.conflict_type) {
            query.conflict_type = parseInt(req.query.conflict_type);
        }

        if (req.query.start_precision) {
            query.start_precision = parseInt(req.query.start_precision);
        }

        // --- PAGINACIÓN ---
        let limit = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);

        if (isNaN(limit)) limit = 0;
        if (isNaN(offset)) offset = 0;

        db.find(query)
            .skip(offset)
            .limit(limit)
            .exec((err, docs) => {

                if (err) {
                    return res.sendStatus(500);
                }

                if (docs.length === 0) {
                    return res.sendStatus(404);
                }

                res.json(docs.map(c => {
                    delete c._id;
                    return c;
                }));

            });

    });

    // --- GET POR AÑO ---
    app.get("/api/v1/conflict-stats/:location/:year", (req, res) => {

        const location = req.params.location;
        const year = parseInt(req.params.year);

        if (isNaN(year)) {
            return res.sendStatus(400);
        }

        db.findOne({ location: location, year: year }, (err, doc) => {

            if (err) return res.sendStatus(500);

            if (!doc) return res.sendStatus(404);

            delete doc._id;

            res.json(doc);
        });

    });

    // --- POST ---
    app.post("/api/v1/conflict-stats", (req, res) => {

        const newConflict = req.body;

        if (!isValidConflict(newConflict)) {
            return res.sendStatus(400);
        }

        db.findOne({
            location: newConflict.location,
            year: newConflict.year
        }, (err, doc) => {

            if (doc) {
                return res.status(409).json({ error: "Resource already exists" });
            }

            db.insert(newConflict, (err, newDoc) => {

                delete newDoc._id;

                res.status(201).json(newDoc);
            });

        });

    });


    // --- PUT ---
    app.put("/api/v1/conflict-stats/:location/:year", (req, res) => {

        const location = req.params.location;
        const year = parseInt(req.params.year);

        const updatedConflict = req.body;

        if (!isValidConflict(updatedConflict)) {
            return res.sendStatus(400);
        }

        if (updatedConflict.location !== location || updatedConflict.year !== year) {
            return res.sendStatus(400);
        }

        db.update(
            { location: location, year: year },
            updatedConflict,
            {},
            (err, numUpdated) => {

                if (err) {
                    return res.sendStatus(500);
                }

                if (numUpdated === 0) {
                    return res.sendStatus(404);
                }

                res.status(200).json(updatedConflict);
            }
        );

    });


    // --- DELETE DATA ---
    app.delete("/api/v1/conflict-stats", (req, res) => {

        db.remove({}, { multi: true }, (err, numRemoved) => {

            if (err) return res.sendStatus(500);

            res.status(200).json({ message: "All data deleted" });

        });

    });


    // --- DELETE RECURSO CONCRETO ---
    app.delete("/api/v1/conflict-stats/:location/:year", (req, res) => {

        const location = req.params.location;
        const year = parseInt(req.params.year);

        if (isNaN(year)) {
            return res.sendStatus(400);
        }

        db.remove(
            { location: location, year: year },
            {},
            (err, numRemoved) => {

                if (numRemoved === 0) {
                    return res.sendStatus(404);
                }

                res.status(200).json({ message: "Deleted" });
            }
        );

    });

    // --- NO PERMITIDOS ---

    app.post("/api/v1/conflict-stats/:year", (req, res) => {
        res.sendStatus(405);
    });

    app.put("/api/v1/conflict-stats", (req, res) => {
        res.sendStatus(405);
    });

    // DOCS
    app.get("/api/v1/conflict-stats/docs", (req, res) => {

        res.redirect("https://documenter.getpostman.com/view/53199914/2sBXigMtL7");

    });

}
