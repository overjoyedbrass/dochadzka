const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router();
const { getUserByUsername, updateLastLogin } = require('../database/users.js')
const { getPerms } = require('../database/perms.js')
const Errors = require("../Errors.js")


router.post('/', async (req, res, next) => {
    try {
        const req_username = req.body.username
        const req_password = req.body.password

        if(!req_username || !req_password){
            throw new Errors.BodyRequiredError("Username or password missing")
        }

        let data = await getUserByUsername(req_username)
        // length == number of rows from database
        if(data.length === 0){
            throw new Errors.UnauthorizedError("Username or password no match")
        }
        data = data[0]
        let perms = (await getPerms(data.status)).map(row => row["perm"])

        bcrypt.compare(req_password, data.password, function (err, result) {
            if(err){
                return next(err)
            }
            //nezhoda v hashoch
            if(!result){
                return next(new Errors.UnauthorizedError("Username or password no match"))
            }
            
            const data_to_hash = {
                id: data.id,
                personal_id: data.personal_id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                status: data.status,
                perms: perms
            }

            const accessToken = jwt.sign(data_to_hash, process.env.SECRET_TOKEN, { expiresIn: process.env.TOKEN_EXPIRATION })
            updateLastLogin(data.id)
            res.send({ 
                token: accessToken
            })
        })
    } catch (err){
        return next(err)
    }
})

module.exports = router;
