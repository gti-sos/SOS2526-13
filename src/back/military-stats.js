import dataStore from "nedb";


export function loadMilitaryStats(app){ 

    let db = new dataStore({filename:"military-stats.db", autoload:true});

}







app.get("/api/v1/military-stats/docs", (req, res) => {
    res.redirect("https://documenter.getpostman.com/view/52632390/2sBXigMDg3");
});