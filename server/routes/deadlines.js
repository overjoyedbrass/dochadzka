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

router.post('/', async (req, res) => {
    const data = req.body

    await deadlines.insert(data)
    
    res.send("OK")
})
module.exports = router;
