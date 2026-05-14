// ─────────────────────────────────────────────────────────────────────────────
// BACKEND v2 — conflict-stats
// Gestiona la API REST para estadísticas de conflictos armados.
// Usa nedb como base de datos embebida (fichero .db en disco).
// ─────────────────────────────────────────────────────────────────────────────

import Datastore from "nedb";

// Abre (o crea si no existe) el fichero conflict-stats.db en disco.
// autoload:true hace que nedb lo lea automáticamente al arrancar sin necesidad
// de llamar a db.loadDatabase() manualmente.
const db = new Datastore({ filename: "conflict-stats.db", autoload: true });

// Prefijo común de todos los endpoints de esta versión de la API.
const API = "/api/v2/conflict-stats";

// ─────────────────────────────────────────────────────────────────────────────
// VALIDACIÓN
// Comprueba que un objeto tiene todos los campos obligatorios de un conflicto.
// Se usa antes de cualquier INSERT o UPDATE para evitar datos incompletos.
// ─────────────────────────────────────────────────────────────────────────────
function isValidConflict(c) {
    return c.location &&                        // localización no vacía
        c.year &&                               // año no vacío
        c.intensity_level !== undefined &&      // puede ser 0, así que se usa !== undefined
        c.conflict_type !== undefined &&
        c.start_precision !== undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL — recibe la instancia de Express y registra todas las rutas
// ─────────────────────────────────────────────────────────────────────────────
export function backendPMA(app) {

    // ── Datos iniciales ───────────────────────────────────────────────────────
    // Array de conflictos de ejemplo que se inserta cuando la BD está vacía.
    const datosPablo = [
        { location: "India",          year: 2012, intensity_level: 1, conflict_type: 3, start_precision: 1 },
        { location: "Egypt, Israel",  year: 1967, intensity_level: 2, conflict_type: 2, start_precision: 1 },
        { location: "Egypt, Israel",  year: 1969, intensity_level: 1, conflict_type: 2, start_precision: 1 },
        { location: "Egypt, Israel",  year: 1970, intensity_level: 1, conflict_type: 2, start_precision: 1 },
        { location: "Egypt, Israel",  year: 1973, intensity_level: 2, conflict_type: 2, start_precision: 1 },
        { location: "Sudan",          year: 2011, intensity_level: 1, conflict_type: 3, start_precision: 1 },
        { location: "South Sudan",    year: 2011, intensity_level: 1, conflict_type: 3, start_precision: 2 },
        { location: "South Sudan",    year: 2012, intensity_level: 1, conflict_type: 3, start_precision: 2 },
        { location: "South Sudan",    year: 2013, intensity_level: 1, conflict_type: 3, start_precision: 2 },
        { location: "South Sudan",    year: 2014, intensity_level: 2, conflict_type: 4, start_precision: 2 }
    ];

    // Clave de API para OpenWeatherMap (usada en el proxy de clima).
    const OWM_API_KEY = '6e8210d096f4ac5a9fcab569e10499bf';

    // ── PROXY: GET /api/v1/proxy/weather ─────────────────────────────────────
    // Actúa como intermediario hacia OpenWeatherMap para evitar problemas de
    // CORS desde el navegador (los navegadores bloquean peticiones directas a
    // APIs externas sin cabeceras CORS adecuadas).
    // Acepta lat, lon, units y lang como query params; tiene valores por defecto
    // para Sevilla en métrico y español.
    // Devuelve el JSON de previsión de 40 bloques (5 días / 3h) tal cual llega.
    app.get('/api/v1/proxy/weather', async (req, res) => {
        const { lat = '37.38', lon = '-5.97', units = 'metric', lang = 'es' } = req.query;

        // Construye la URL hacia la API real de OpenWeatherMap
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&cnt=40&appid=${OWM_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log('OpenWeather response:', JSON.stringify(data));
        res.json(data); // Reenvía la respuesta al cliente
    });

    // ── GET /api/v2/conflict-stats/loadInitialData ────────────────────────────
    // Carga los datos de ejemplo solo si la BD está vacía.
    // Responde 201 si los inserta, 409 si ya había datos (idempotente).
    app.get(API + "/loadInitialData", (req, res) => {

        // Cuenta todos los documentos de la colección
        db.count({}, (err, count) => {

            if (count === 0) {
                // BD vacía → inserta los datos iniciales
                db.insert(datosPablo, () => {
                    res.sendStatus(201); // 201 Created
                });
            } else {
                // Ya hay datos → no hace nada y avisa al cliente
                res.sendStatus(409); // 409 Conflict
            }
        });
    });

    // ── GET /api/v2/conflict-stats ────────────────────────────────────────────
    // Devuelve la colección completa, con soporte de filtros y paginación.
    // Query params opcionales:
    //   - location, year, intensity_level, conflict_type, start_precision → filtros exactos
    //   - limit  → número máximo de resultados (0 = sin límite en nedb)
    //   - offset → número de resultados a saltar (paginación)
    app.get(API, (req, res) => {

        let query = {}; // Objeto de consulta para nedb (vacío = todos los documentos)

        // Construye el filtro dinámicamente solo con los params que lleguen
        if (req.query.location)       query.location       = req.query.location;
        if (req.query.year)           query.year           = parseInt(req.query.year);
        if (req.query.intensity_level) query.intensity_level = parseInt(req.query.intensity_level);
        if (req.query.conflict_type)  query.conflict_type  = parseInt(req.query.conflict_type);
        if (req.query.start_precision) query.start_precision = parseInt(req.query.start_precision);

        // Paginación: si no se pasan o son NaN, nedb los trata como 0 (sin límite/sin salto)
        let limit  = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        if (isNaN(limit))  limit  = 0;
        if (isNaN(offset)) offset = 0;

        db.find(query)
            .skip(offset)   // salta los primeros `offset` resultados
            .limit(limit)   // limita el número de resultados
            .exec((err, docs) => {

                if (err) return res.sendStatus(500);

                // Elimina el campo interno _id de nedb antes de devolver los datos
                res.json(docs.map(c => {
                    delete c._id;
                    return c;
                }));
            });
    });

    // ── GET /api/v2/conflict-stats/:location/:year ────────────────────────────
    // Devuelve un único recurso identificado por su localización y año.
    // Responde 400 si el año no es un número, 404 si no existe.
    app.get(API + "/:location/:year", (req, res) => {

        const location = req.params.location;
        const year = parseInt(req.params.year);

        if (isNaN(year)) return res.sendStatus(400); // año inválido

        // Busca exactamente un documento que coincida con location + year
        db.findOne({ location: location, year: year }, (err, doc) => {

            if (err)  return res.sendStatus(500);
            if (!doc) return res.sendStatus(404); // no encontrado

            delete doc._id; // limpia el campo interno de nedb
            res.json(doc);
        });
    });

    // ── POST /api/v2/conflict-stats ───────────────────────────────────────────
    // Crea un nuevo conflicto a partir del body JSON.
    // Responde 400 si faltan campos, 409 si ya existe un conflicto con el mismo
    // location+year (clave compuesta), 201 con el recurso creado si todo va bien.
    app.post(API, (req, res) => {

        const newConflict = req.body;

        // Valida que todos los campos obligatorios estén presentes
        if (!isValidConflict(newConflict)) return res.sendStatus(400);

        // Comprueba si ya existe un conflicto con la misma clave compuesta
        db.findOne({ location: newConflict.location, year: newConflict.year }, (err, doc) => {

            if (doc) {
                // Ya existe → no se puede insertar un duplicado
                return res.status(409).json({ error: "Resource already exists" });
            }

            // No existe → lo inserta en la BD
            db.insert(newConflict, (err, newDoc) => {
                delete newDoc._id; // limpia el _id interno antes de responder
                res.status(201).json(newDoc);
            });
        });
    });

    // ── PUT /api/v2/conflict-stats/:location/:year ────────────────────────────
    // Reemplaza completamente un recurso existente.
    // Exige que el body incluya location y year iguales a los de la URL
    // (no se permite cambiar la clave primaria con un PUT).
    // Responde 404 si el recurso no existe, 200 con los datos actualizados si ok.
    app.put(API + "/:location/:year", (req, res) => {

        const location = req.params.location;
        const year = parseInt(req.params.year);
        const updatedConflict = req.body;

        // Validación de campos obligatorios
        if (!isValidConflict(updatedConflict)) return res.sendStatus(400);

        // El body debe tener la misma clave que la URL (no se puede reubicar el recurso)
        if (updatedConflict.location !== location || updatedConflict.year !== year) {
            return res.sendStatus(400);
        }

        // Actualiza el documento que coincida con location + year
        db.update(
            { location: location, year: year }, // criterio de búsqueda
            updatedConflict,                    // nuevo contenido completo
            {},                                 // opciones (vacío = actualiza solo el primero)
            (err, numUpdated) => {

                if (err)           return res.sendStatus(500);
                if (numUpdated === 0) return res.sendStatus(404); // no encontrado

                res.status(200).json(updatedConflict);
            }
        );
    });

    // ── DELETE /api/v2/conflict-stats ─────────────────────────────────────────
    // Borra TODOS los documentos de la colección.
    // multi:true es necesario en nedb para borrar más de un documento a la vez.
    app.delete(API, (req, res) => {

        db.remove({}, { multi: true }, (err, numRemoved) => {

            if (err) return res.sendStatus(500);
            res.status(200).json({ message: "All data deleted" });
        });
    });

    // ── DELETE /api/v2/conflict-stats/:location/:year ─────────────────────────
    // Borra un único recurso identificado por location + year.
    // Responde 400 si el año no es válido, 404 si no existe el recurso.
    app.delete(API + "/:location/:year", (req, res) => {

        const location = req.params.location;
        const year = parseInt(req.params.year);

        if (isNaN(year)) return res.sendStatus(400);

        db.remove(
            { location: location, year: year },
            {}, // sin multi:true → borra solo el primero que coincida
            (err, numRemoved) => {

                if (numRemoved === 0) return res.sendStatus(404);
                res.status(200).json({ message: "Deleted" });
            }
        );
    });

    // ── Métodos NO permitidos ─────────────────────────────────────────────────
    // Express registra estas rutas para devolver 405 Method Not Allowed
    // en lugar del genérico 404, siendo más correcto semánticamente.

    // POST sobre un recurso concreto no tiene sentido (para eso está PUT)
    app.post(API + "/:year", (req, res) => {
        res.sendStatus(405);
    });

    // PUT sobre la colección entera no está permitido
    app.put(API, (req, res) => {
        res.sendStatus(405);
    });

    // ── GET /api/v2/conflict-stats/docs ──────────────────────────────────────
    // Redirige a la documentación de la API publicada en Postman.
    app.get(API + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/53199914/2sBXijJXMJ");
    });
}