var express = require('express');
var router = express.Router();

var deadlines = require("../database/deadlines.js")

router.get('/', async (req, res) => {
    const year = req.query.year
    
    if(!year){
        res.status(400).end()
        return
    }
    const data = await deadlines.getDeadlinesByYear(year)
    res.send(data)
});

router.put('/', async (req, res) => {
    const data = req.body
    const year = req.query.year

    if(!data || data?.length === 0 || !year){
        res.status(400)
        res.end()
    }
    try {
        await deadlines.replace(year, data)
    }
    catch(err){
        console.log(err)
        res.status(400)
        res.end()
    }
    
    res.end()
})
module.exports = router;
