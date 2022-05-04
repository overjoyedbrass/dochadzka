var express = require('express');
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var router = express.Router();
var { getUserByUsername } = require('../database/users.js')
var getPerms = require('../perms/permissions.js')

router.post('/', async (req, res) => {
    const req_username = req.body.username
    const req_password = req.body.password
    

    if(!req_username || !req_password){
        res.status(401)
        res.end()
        return
    }

    let data = await getUserByUsername(req_username)
    // length == number of rows from database
    if(data.length === 0){
        res.status(401).end()
        return
    }
    data = data[0]

    bcrypt.compare(req_password, data.password, function (err, result) {
        // nezhoda v hashoch
        if(!result){
            res.status(401).end()
            return
        }

        const data_to_hash = {
            id: data.id,
            personal_id: data.personal_id,
            username: data.username,
            name: data.name,
            surname: data.surname,
            email: data.email,
            status: data.status,
            perms: getPerms(data.status)
        }
        const accessToken = jwt.sign(data_to_hash, process.env.SECRET_TOKEN, { expiresIn: "7d" })
        res.send({ 
            token: accessToken
        })
        return
    })
})

module.exports = router;
