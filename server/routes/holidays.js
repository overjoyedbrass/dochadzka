var express = require('express');
var router = express.Router();
var holidays = require('../database/holidays.js')

router.get('/', async (req, res) => {
    const year = req.query.year

    if(!year){
        res.status(400).end()
        return
    }
    const data = await holidays.getHolidaysByYear(year)
    res.send(data)
});

router.post('/', async (req, res) => {
    const data = req.body
    await holidays.insert(data)
    res.send("OK")
})

module.exports = router;
