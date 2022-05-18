const express = require('express');
const router = express.Router();
const holidays = require('../database/holidays.js')
const Errors = require("../Errors.js")

router.get('/', async (req, res, next) => {
    try {
        const year = req.query.year
        if(!year){
            throw Errors.MissingArgumentError("argument year missing")
        }
        const data = await holidays.getHolidaysByYear(year)
        res.send(data)
    } catch (err) {
        return next(err)
    }
});

router.post("/", async (req, res, next) => {
    try {
        if(!req.auth?.perms?.includes('edit_holidays')){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }

        const data = req.body
        if(!data || data === {}){
            throw new Errors.BodyRequiredError("One or more fields missing")
        }

        await holidays.insert(data)
        res.end()

    } catch (err) {
        return next(err)
    }
})

router.patch('/:id', async (req, res, next) => {
    try {
        if(!req.auth?.perms?.includes('edit_holidays')){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }

        const id = req.params.id
        if(!id){
            throw Errors.MissingArgumentError("argument id missing")
        }

        const data = req.body
        if(!data || data === {}){
            throw new Errors.BodyRequiredError("One or more fields missing")
        }

        await holidays.update(id, data)
        res.end()

    } catch (err) {
        return next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        if(!req.auth || !req.auth?.perms?.includes('edit_holidays')){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }
        
        const id = req.params.id
        if(!id){
            throw Errors.MissingArgumentError("argument id missing")
        }
        await holidays.delete(id)
        res.end()
    } catch (err) {
        return next(err)
    }
})

module.exports = router;