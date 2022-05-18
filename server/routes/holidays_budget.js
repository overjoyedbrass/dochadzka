const express = require('express');
const router = express.Router();
const holidays_budget = require('../database/holidays_budget.js')
const Errors = require("../Errors.js")

router.get('/', async (req, res, next) => {
    try {
        const year = req.query.year
        if(!year){
            throw Errors.MissingArgumentError("argument year missing")
        }
        const data = await holidays_budget.getHolidaysBudgetByYear(year)
        res.send(data)
    } catch (err){
        return next(err)
    }
});


router.put('/', async (req, res, next) => {
    try {
        if(!req.auth?.perms?.includes('edit_budgets')){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }

        const data = req.body
        const year = req.query.year
        if(!year){
            throw Errors.MissingArgumentError("argument year missing")
        }
        if(!data || data === {}){
            throw Errors.BodyRequiredError("No data provided")
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
