var express = require('express');
var router = express.Router();

var deadlines = require("../database/deadlines.js")

router.get('/', async (req, res, next) => {
    try {
        const year = req.query.year
        
        if(!year){
            throw Error("MissingArgument")
        }
        const data = await deadlines.getDeadlinesByYear(year)
        res.send(data)
    } catch(err){
        return next(err)
    }
});

router.put('/', async (req, res, next) => {
    try{
        const data = req.body
        const year = req.query.year

        if(!data || data?.length === 0 || !year){
            throw Error("PatchDataMissing")
        }
        await deadlines.replace(year, data)        
        res.end()
        
    } catch (err) {
        return next(err)
    }
})
module.exports = router;
