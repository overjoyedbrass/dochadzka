const express = require('express');
const router = express.Router();
const users = require('../database/users')
const bcrypt = require('bcrypt')


function hashPassword(plainText){
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainText, 10, (error, hash) => {
            if(error){
                return reject(error)
            }
            return resolve(hash)
        })
    })
}

function checkPassword(plainText, hash){
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainText, hash, (error, result) => {
            if(error){
                return reject(error)
            }
            return resolve(result)
        })
    })
}


router.get('/', async (req, res) => {
    const data = await users.getUsers()
    res.send(data)
})

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId
    if(!userId){
        res.status(400)
        res.end()
    }
    const data = await users.getUserById(userId)
    res.send(data)
})


router.patch("/:userId", async (req, res) => {
    const userId = req.params.userId

    if(!userId){
        res.status(400)
        res.end()
    }
    const data = req.body;
    data.id = userId

    const user = (await users.getUserById(userId, true))[0]

    const compareResult = await checkPassword(data.password, user.password)

    if(!compareResult){
        res.status(400)
        res.end()
        return
    }

    data.newPassword = data.newPassword ? await hashPassword(data.newPassword) : null

    await users.updateUser(data)
    
    res.end()
})

router.post("/", async (req, res) => {
    const data = req.body;

    // insert user into database

    res.end()
})


module.exports = router;
