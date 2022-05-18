const express = require('express');
const router = express.Router();
const users = require('../database/users')
const bcrypt = require('bcrypt')
const Errors = require("../Errors.js")

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
            throw new Errors.MissingArgumentError("argument userId missing")
        }
        const data = await users.getUserById(userId)
        res.send(data)        
    } catch (err) {
        return next(err)
    }
})


router.patch("/:userId", async (req, res, next) => {
    try {
        if(!req.auth){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }

        const userId = req.params.userId
        if(!userId){
            throw new Errors.MissingArgumentError("Argument userId missing")
        }

        const user = req.auth
        const data = req.body;
        const has_user_managment = user.perms?.includes("user_managment")
        data.id = userId
        if((user.id != userId && !has_user_managment) ||
           (!data.password && !has_user_managment)){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }
        if(data.password && !has_user_managment){
            const user = (await users.getUserById(userId, true))[0]
            const compareResult = await checkPassword(data.password, user.password)
            if(!compareResult){
                throw new Errors.BadCredentialsError("Password no match")
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
        if(!req.auth?.perms?.includes('user_managment')){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }

        const data = req.body;
        if(!data || !data.password){
            throw new Errors.BodyRequiredError("Missing fields in body (password)")
        }
        data.password = await hashPassword(data.password)
        await users.insertUser(data);
        res.end()

    } catch (err) {
        return next(err)
    }
})


module.exports = router;
