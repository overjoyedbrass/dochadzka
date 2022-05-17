var express = require('express');
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var router = express.Router();
var { getUserByUsername } = require('../database/users.js')
var { getPerms } = require('../database/perms.js')

router.post('/', async (req, res, next) => {
    try {
        const req_username = req.body.username
        const req_password = req.body.password

        if(!req_username || !req_password){
            throw Error("MissingArgument")
        }

        let data = await getUserByUsername(req_username)
        // length == number of rows from database
        if(data.length === 0){
            throw Error("BadCredentials")
        }
        data = data[0]
        let perms = (await getPerms(data.status)).map(row => row["key"])

        bcrypt.compare(req_password, data.password, function (err, result) {
            if(err){
                throw(err)
            }
            //nezhoda v hashoch
            if(!result){
                throw Error("BadCredentials")
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
            const accessToken = jwt.sign(data_to_hash, process.env.SECRET_TOKEN, { expiresIn: "7d" })
            res.send({ 
                token: accessToken
            })
        })
    } catch (err){
        return next(err)
    }
})

module.exports = router;
