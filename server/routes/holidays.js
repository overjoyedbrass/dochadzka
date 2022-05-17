var express = require('express');
var router = express.Router();
var holidays = require('../database/holidays.js')

router.get('/', async (req, res, next) => {
    try {
        const year = req.query.year
        if(!year){
            throw Error("MissingArgument")
        }
        const data = await holidays.getHolidaysByYear(year)
        res.send(data)
    } catch (err) {
        return next(err)
    }
});

router.post("/", async (req, res, next) => {
    try {
        const data = req.body
        await holidays.insert(data)
        res.end()

    } catch (err) {
        return next(err)
    }
})

router.patch('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        if(!id){
            throw Error("MissingArgument")
        }
        const data = req.body
        await holidays.update(id, data)
        res.end()

    } catch (err) {
        return next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        if(!id){
            throw Error("MissingArgument")
        }
        await holidays.delete(id)
        res.end()
    } catch (err) {
        return next(err)
    }
})

module.exports = router;
