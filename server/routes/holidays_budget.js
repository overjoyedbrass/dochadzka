var express = require('express');
var router = express.Router();
const holidays_budget = require('../database/holidays_budget.js')

router.get('/', async (req, res) => {
    const year = req.query.year
    if(!year){
        res.status(400).end()
        return
    }
    const data = await holidays_budget.getHolidaysBudgetByYear(year)
    res.send(data)
});

module.exports = router;
