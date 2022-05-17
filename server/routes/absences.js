const express = require('express');
const router = express.Router();
const absences = require('../database/absences.js');

router.get('/', async (req, res, next) => {
    try {
        const [month, year, userid, rq_only] = [req.query.month, req.query.year, req.query.userid, req.query.rq_only]

        if(!year){
            throw next(Error("MissingArgument"))
        }

        if(rq_only){
            let data;
            data = await absences.getRequestsByYear(year)
            res.send(data)
            return
        }

        if(!month){
            throw next(Error("MissingArgument"))
        }

        let data;
        if(!userid){
            data = await absences.getAbsencesByYearMonth(year, month)
        }
        else {
            data = await absences.getAbsencesByYearMonthUser(year, month, userid)
        }
        res.send(data)
    } catch (err) {
        return next(err)
    }
});

router.get('/:absenceId', async (req, res, next) => {
    try {
        const absenceId = req.params.absenceId
        if(!absenceId){
            res.status(400)
            res.end()
            return
        }
        
        const arrayWithOneRow = await absences.getAbsenceById(absenceId)
        const data = arrayWithOneRow[0]

        res.send(data)
    } catch (err) {
        return next(err)
    }
})

router.post('/',  async(req, res, next) => {
    try {
        const data = req.body    
        await absences.insertAbsences(data)
        res.end()
    } catch (err) {
        return next(err)
    }
})

router.patch("/:id", async(req, res, next) => {
    try {
        const id = req.params.id;
        if(!id){
            throw Error("MissingArgument")
        }

        const data = req.body
        data.id = id
        await absences.update(data)
        res.end()
    } catch (err) {
        return next(err)
    }
})

router.delete("/:id", async(req, res, next) => {
    try {
        const id = req.params.id;
        if(!id){
            res.status(400)
            res.end()
        }
        
        await absences.delete(id)


        console.log(err)

        res.end()
    } catch (err) {
        return next(err)
    }
})

module.exports = router;
