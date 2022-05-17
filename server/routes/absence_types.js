const express = require('express');
const router = express.Router();
const { getAbsenceTypes } = require('../database/absence_types.js');

router.get('/', async (req, res, next) => {
    try {
        const data = await getAbsenceTypes();
        res.send(data);
    } catch (err){
        return next(err)
    }
})

module.exports = router