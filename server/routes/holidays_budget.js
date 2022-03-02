var express = require('express');
var router = express.Router();
const holidays_budget = require('../database/holidays_budget.js')
router.get('/', async (req, res) => {
    const userId = req.query.user_id
    if(!userId){
        res.send("missing userid argument")
        return
    }
    const data = await holidays_budget.getHolidaysBudgetByUser(userId)
    res.send(data)
});

module.exports = router;
