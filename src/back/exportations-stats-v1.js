import dataStore from "nedb";

let BASE_URL = '/api/v1/exportations-stats';
let DOCS_URL = "https://documenter.getpostman.com/view/52406650/2sBXigMYhP";
export function loadExportationsV1(app){
    let db = new dataStore({filename:"exportations-v1.db", autoload:true});
    let exportationsInitial =  [
                { recipient: "Afghanistan", supplier: "Russia", year_of_order: 2002, tiv_total_order: 8.7 },
                { recipient: "Algeria", supplier: "Ukraine", year_of_order: 2003, tiv_total_order: 22.04 },
                { recipient: "Angola", supplier: "Cuba", year_of_order: 1975, tiv_total_order: 1.2 },
                { recipient: "Egypt", supplier: "Spain", year_of_order: 1982, tiv_total_order: 187.4 },
                { recipient: "El Salvador", supplier: "United States", year_of_order: 1969, tiv_total_order: 3 },
                { recipient: "Equatorial Guinea", supplier: "Israel", year_of_order: 2008, tiv_total_order: 45 },
                { recipient: "Estonia", supplier: "France", year_of_order: 2007, tiv_total_order: 9 },
                { recipient: "Ethiopia", supplier: "China", year_of_order: 2019, tiv_total_order: 22.5 },
                { recipient: "Greece", supplier: "Germany", year_of_order: 2020, tiv_total_order: 79.2 },
                { recipient: "Spain", supplier: "Italy", year_of_order: 1975, tiv_total_order: 30.8 }
            ];

    //LoadInitialData
    app.get(BASE_URL+"/loadInitialData",(req,res)=>{
        db.find({},(err,data)=>{
            if(data.length===0){
                db.insert(exportationsInitial);
                res.sendStatus(201);
            }else{
                res.sendStatus(409);
            }
        });
    });


    // GET colección (con búsquedas y paginación)
    app.get(BASE_URL,(req,res)=>{
        let query={};
        if(req.query.recipient) query.recipient=req.query.recipient;
        if(req.query.supplier) query.supplier=req.query.supplier;
        if(req.query.year_of_order) query.year_of_order=parseInt(req.query.year_of_order);

        let limit=parseInt(req.query.limit);
        let offset=parseInt(req.query.offset);
        let search=db.find(query);
        if(offset) search=search.skip(offset);
        if(limit) search=search.limit(limit);
        
        search.exec((err,data)=>{
            if(err){
                console.error(err);
                return res.sendStatus(500);
            }
            if(!data){
                return res.json([]);
            }
            data.forEach(d=>delete d._id);
            res.json(data);
        });
    });

    //GET recurso concreto
    app.get(BASE_URL+"/:recipient/:year_of_order",(req,res)=>{
        let recipient=req.params.recipient;
        let year=parseInt(req.params.year_of_order);

        db.find({recipient:recipient,year_of_order:year},(err,data)=>{
            if(data.length===0){
                res.sendStatus(404);
            }else{
                delete data[0]._id;
                res.json(data[0]);
            }
        });
    });

    // POST
    app.post(BASE_URL,(req,res)=>{
        let newData=req.body;
        if(!newData.recipient || !newData.supplier || !newData.year_of_order || !newData.tiv_total_order){
            return res.sendStatus(400);
        }
        db.find({recipient:newData.recipient,year_of_order:newData.year_of_order},(err,data)=>{
            if(data.length>0){
                res.sendStatus(409);
            }else{
                db.insert(newData);
                res.sendStatus(201);
                }
            });
        });

        // POST no permitido en recurso concreto
    app.post(BASE_URL+"/:recipient/:year_of_order",(req,res)=>{
        res.sendStatus(405);
    });


    // PUT actualizar recurso
    app.put(BASE_URL+"/:recipient/:year_of_order",(req,res)=>{
        let recipient=req.params.recipient;
        let year=parseInt(req.params.year_of_order);
        let updated=req.body;
        updated.year_of_order = parseInt(updated.year_of_order);
        if(recipient!==updated.recipient || year!==updated.year_of_order){
            return res.sendStatus(400);
        }
        db.update(
            {recipient:recipient,year_of_order:year},
            {$set: updated},
            {},(err,numUpdated)=>{
                if(numUpdated===0){
                    res.sendStatus(404);
                }else{
                    res.sendStatus(200);
                }
            });
        });

     // PUT no permitido en colección
    app.put(BASE_URL,(req,res)=>{
        res.sendStatus(405);
    });


    // DELETE recurso concreto
    app.delete(BASE_URL+"/:recipient/:year_of_order",(req,res)=>{

        let recipient=req.params.recipient;
        let year=parseInt(req.params.year_of_order);
        db.remove({recipient:recipient,year_of_order:year},{},(err,numRemoved)=>{
            if(numRemoved===0){ 
                res.sendStatus(404);
            }else{
                res.sendStatus(200);
            }
        });
    });


    // DELETE colección
    app.delete(BASE_URL,(req,res)=>{
        db.remove({}, {multi:true},(err,numRemoved)=>{
            res.sendStatus(200);
        });
    });

    app.get(BASE_URL + "/docs", (req, res) => {
    console.log("Getting DOCS");
    res.redirect(DOCS_URL);
  });
}