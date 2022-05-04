const express = require('express');
const router = express.Router();
const absences = require('../database/absences.js');

router.get('/', async (req, res) => {
    const [month, year, userid, rq_only] = [req.query.month, req.query.year, req.query.userid, req.query.rq_only]

    if(!year){
        res.status(400)
        res.end()
        return
    }

    if(rq_only){
        let data;
        data = await absences.getRequestsByYear(year)
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

router.get('/:absenceId', async (req, res) => {
    const absenceId = req.params.absenceId
    if(!absenceId){
        res.status(400)
        res.end()
        return
    }
    
    const arrayWithOneRow = await absences.getAbsenceById(absenceId)
    const data = arrayWithOneRow[0]

    res.send(data)
})

router.post('/',  async(req, res) => {
    const data = req.body

    try {
        await absences.insertAbsences(data)
    }
    catch(err){
        console.log(err)
        res.status(400)
    }
    res.end()
})

router.patch("/:id", async(req, res) => {
    const id = req.params.id;

    if(!id){
        res.status(400)
        res.end()
    }
    const data = req.body
    // just in case
    data.id = id
    await absences.update(data)

    res.end()
})

router.delete("/:id", async(req, res) => {
    const id = req.params.id;
    if(!id){
        res.status(400)
        res.end()
    }
    try{
        await absences.delete(id)
    }
    catch(err){
        console.log(err)
    }
    res.end()
})


module.exports = router;
