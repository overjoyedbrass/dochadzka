const express = require('express');
const router = express.Router();
const deadlines = require("../database/deadlines.js")
const Errors = require("../Errors.js")

router.get('/', async (req, res, next) => {
    try {
        const year = req.query.year
        const month = req.query.month
        
        if(!year){
            throw new Errors.MissingArgumentError("argument year missing")
        }

        const data = month ? 
            await deadlines.getDeadlineByYearMonth(year, month)
          : await deadlines.getDeadlinesByYear(year)
          
        res.send(data)
    } catch(err){
        return next(err)
    }
});

router.put('/', async (req, res, next) => {
    try{
        if(!req.auth?.perms?.includes('edit_deadlines')){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }
                
        const data = req.body
        if(!data || data === {}){
            throw new Errors.BodyRequiredError("No data provided")
        }

        const year = req.query.year
        if(!year){
            throw new Errors.MissingArgumentError("argument year missing")
        }
        await deadlines.replace(year, data)        
        res.end()

    } catch (err) {
        return next(err)
    }
})
module.exports = router;
