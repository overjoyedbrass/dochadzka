const express = require('express');
const router = express.Router();
const tickets = require('../database/tickets')
const Errors = require("../Errors.js")

router.get('/', async (req, res, next) => {
    try {
        const user_id = req.query.user_id
        const year = req.query.year
        const month = req.query.month

        if(!user_id || !year || !month) {
            throw new Errors.MissingArgumentError("Missing 1 of arguments (user, year, month)")
        }
        const data = await tickets.getTicketsByYearMonth(year, month, user_id)
        res.send(data)

    } catch (err) {
        return next(err)
    }
});

router.put('/', async (req, res, next) => {
    try {
        const ticket = req.body

        if(!ticket || ticket === {}){
            throw new Errors.BodyRequiredError("Ticket missing")
        }
        await tickets.insertTicket(ticket)

    } catch (err) {
        return next(err)
    }
    res.end()
});
module.exports = router