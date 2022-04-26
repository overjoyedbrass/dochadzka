const express = require('express');
const router = express.Router();
const absences = require('../database/absences.js');

router.get('/', async (req, res) => {
    const [month, year, userid, request] = [req.query.month, req.query.year, req.query.userid, req.query.request]

    if(!year){
        res.status(400).end()
        return
    }

    if(request){
        let data;
        data = await absences.getRequestsByYear(year)
        console.log("data", data)
        res.send(data)
        return
    }

    if(!month){
        res.status(400).end()
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
