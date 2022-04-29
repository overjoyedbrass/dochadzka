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

router.post("/", async (req, res) => {
    const data = req.body

    try {
        await holidays.insert(data)
    }
    catch(err){
        console.log(err)
        res.status(400)
    }
    res.end()
})

router.patch('/:id', async (req, res) => {
    const id = req.params.id

    if(!id){
        res.status(400)
        res.end()
        return
    }

    const data = req.body

    try {
        await holidays.update(id, data)
    }
    catch(err){
        console.log(err)
        res.status(400)
    }

    res.end()
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id
    if(!id){
        res.status(400)
        res.end()
    }
    try {
        await holidays.delete(id)
    }
    catch(err){
        res.status(400)
    }
    res.end()
})

module.exports = router;
