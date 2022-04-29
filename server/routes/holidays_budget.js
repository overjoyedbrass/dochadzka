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


router.put('/', async (req, res) => {
    const data = req.body
    const year = req.query.year
    if(!year || !data){
        res.status(400)
        res.end()
        return
    }
    try{
        const rows = []
        for (const [user, number] of Object.entries(data)) {
            rows.push([user, number, year])
        }
        await holidays_budget.replaceHolidaysBudgetsWithYear(year, rows)
    }
    catch(err){
        console.log(err)
        res.status(400)
    }    
    res.end()
})

module.exports = router;
