const express = require('express');
const router = express.Router();
const { getAbsenceTypes } = require('../database/absence_types.js');

router.get('/', async (req, res) => {
    const data = await getAbsenceTypes();
    res.send(data);
})

module.exports = router