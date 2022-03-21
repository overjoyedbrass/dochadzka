const express = require('express');
const router = express.Router();
const users = require('../database/users')

router.get('/', async (req, res) => {
    const data = await users.getUsers()
    res.send(data)
})

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId
    if(!userId){
        res.send("User Id is missing")
    }
    const data = await users.getUserById(userId)
    res.send(data)
})


module.exports = router;
