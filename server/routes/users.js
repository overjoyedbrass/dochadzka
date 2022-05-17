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


router.get('/', async (req, res, next) => {
    try {
        const data = await users.getUsers()
        res.send(data)
    } catch (err) {
        return next(err)
    }
})

router.get('/:userId', async (req, res, next) => {
    try {
        const userId = req.params.userId
        if(!userId){
            throw Error("MissingArgument")
        }
        const data = await users.getUserById(userId)
        res.send(data)        
    } catch (err) {
        return next(err)
    }
})


router.patch("/:userId", async (req, res, next) => {
    try {
        const userId = req.params.userId
        if(!userId){
            throw Error("MissingArgument")
        }
        const data = req.body;
        data.id = userId

        if(data.password){
            const user = (await users.getUserById(userId, true))[0]
            const compareResult = await checkPassword(data.password, user.password)
            if(!compareResult){
                throw Error("BadCredentials")
            }
        }
        data.newPassword = data.newPassword ? await hashPassword(data.newPassword) : null
        await users.updateUser(data)        
        res.end()
    } catch(err) {
        return next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const data = req.body;

        if(!data || !data.password){
            throw Error("BodyMissing")
        }
        data.password = await hashPassword(data.password)
        await users.insertUser(data);
        res.end()

    } catch (err) {
        return next(err)
    }
})


module.exports = router;
