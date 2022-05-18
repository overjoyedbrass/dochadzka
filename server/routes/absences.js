const express = require('express');
const router = express.Router();
const absences = require('../database/absences.js');
const Errors = require("../Errors.js")

// returns empty string if everything OK
// else returns message what is wrong
async function checkAbsences(user, absences){
    return false
}

async function checkAbsencePatch(user, absence){
    return false
}

async function checkAbsenceDelete(user, id){

}

router.get('/', async (req, res, next) => {
    try {
        const [month, year, userid, rq_only] = [req.query.month, req.query.year, req.query.userid, req.query.rq_only]

        if(!year){
            throw new Errors.MissingArgumentError("YEAR is missing")
        }

        if(rq_only){
            let data;
            data = await absences.getRequestsByYear(year)
            return res.send(data)            
        }

        if(!month){
            throw new Errors.MissingArgumentError("MONTH is missing")
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
            throw new Errors.MissingArgumentError("absenceId missing")
        }
        
        const arrayWithOneRow = await absences.getAbsenceById(absenceId)
        const data = arrayWithOneRow[0]
        if(!arrayWithOneRow.length || !data){
            throw new Errors.IdMatchNoEntry(`Absence ID ${absenceId} doesn't exist`)
        }
        return res.send(data)

    } catch (err) {
        return next(err)
    }
})

router.post('/',  async(req, res, next) => {
    try {
        const data = req.body
        if(!data || !data.length){
            throw new Errors.BodyRequiredError("No data provided")
        }
        if(!req.auth){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }

        const result_message = await checkAbsences(req.auth, data);
        if(result_message){
            throw new Errors.UnauthorizedActionError(result_message)
        }

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
            throw new Errors.MissingArgumentError("argument id missing")
        }
        if(!req.auth){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }
        
        const data = req.body

        if(!data || data === {}){
            throw new Errors.BodyRequiredError("No patch provided")
        }
        data.id = id

        const result_message = await checkAbsencePatch(req.auth, data)
        if(result_message){
            throw new Errors.UnauthorizedActionError(result_message)
        }

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
            throw new Errors.MissingArgumentError("argument id missing")
        }   
        
        if(!req.auth){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }

        const result_message = await checkAbsenceDelete(req.auth, id)
        if(result_message){
            throw new Errors.UnauthorizedActionError(result_message)
        }

        await absences.delete(id)
        res.end()

    } catch (err) {
        return next(err)
    }
})

module.exports = router;
