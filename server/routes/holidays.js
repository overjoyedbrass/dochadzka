var express = require('express');
var router = express.Router();
var holidays = require('../database/holidays.js')

router.get('/', async (req, res) => {
    const [month, year] = [req.query.month, req.query.year]

    if(!month || !year){
        res.status(400).end()
        return
    }
    const data = await holidays.getHolidaysByYearMonth(year, month)
    res.send(data)
});

router.post('/', async (req, res) => {
    const data = req.body
    await holidays.insert(data)
    res.send("OK")
})

module.exports = router;
