const express = require('express');
const router = express.Router();
const users = require('../database/users')
const bcrypt = require('bcrypt')
const Errors = require("../Errors.js")
const jwt = require('jsonwebtoken')


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

router.patch('/', async (req, res, next) => {
    try {
        const data = req.body
        if(!data || !data.token || !data.id || !data.newpass){
            throw new Errors.BodyRequiredError("Fields missing in Body")
        }
        const id = data.id
        const token = data.token
        const newpass = data.newpass
        const user = (await users.getUserById(id, true))[0]
        const USER_SECRET = user.token

        if(!user){
            throw new Errors.IdMatchNoEntry("User doesnt exist")
        }

        jwt.verify(token, USER_SECRET, async function(err, decoded) {
            if(err){
                return next(err)
            }
            if(id != decoded.id){
                return next(new Errors.UnauthorizedError("requested ID differs from ID in token"))
            }

            const PASS_HASH = await hashPassword(newpass)
            console.log("PASS_HASH", PASS_HASH)
            console.log("id", id)
            await users.updateUser(id, { password: PASS_HASH })            
            res.status(202).end()
        });
    } catch (err) {
        return next(err)
    }
})

module.exports = router;