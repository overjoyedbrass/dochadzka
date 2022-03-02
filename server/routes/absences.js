var express = require('express');
const absences = require('../database/absences.js');
var router = express.Router();

router.get('/', async (req, res) => {
    const [month, year, userid] = [req.query.month, req.query.year, req.query.userid]
    if(!month && !year && !userid){
        const data = await absences.getAbsences()
        res.send(data)
        return
    }
    console.log("query: ", req.query)

    if(!month || !year){
        res.send("Missing argument Month or Year")
        return
    }
    let data;
    if(!userid){
        data = await absences.getAbsencesByYearMonth(year, month)
    }
    else {
        data = await absences.getAbsencesByYearMonthUser(year, month, userid)
    }
    res.send(data)
});

router.post('/',  async(req, res) => {
    const data = req.body
    absences.insert(data)
    res.send("OK")
})


module.exports = router;
