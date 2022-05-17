var express = require('express');
var router = express.Router();
const holidays_budget = require('../database/holidays_budget.js')

router.get('/', async (req, res, next) => {
    try {
        const year = req.query.year
        if(!year){
            throw Error("MissingArgument")
        }
        const data = await holidays_budget.getHolidaysBudgetByYear(year)
        res.send(data)
    } catch (err){
        return next(err)
    }
});


router.put('/', async (req, res, next) => {
    try {
        const data = req.body
        const year = req.query.year
        if(!year || !data){
            throw Error("MissingArgument")
        }
        const rows = []
        for (const [user, number] of Object.entries(data)) {
            rows.push([user, number, year])
        }
        await holidays_budget.replaceHolidaysBudgetsWithYear(year, rows)
        res.end()
    } catch(err) {
        return next(err)
    }
})

module.exports = router;
