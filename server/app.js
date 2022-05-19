require("dotenv").config();

const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT;

const bodyParser = require('body-parser');
const expressjwt = require("express-jwt");
const jwt = require('jsonwebtoken')
const Errors = require("./Errors.js")
const fs = require("fs")

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// app use cors
app.use(cors())

// generate secret token
//require('crypto').randomBytes(64).toString('hex') 

// express static - automatically renders react app on "/"
app.use(express.static("public"))

// jwt middleware
app.use(
    expressjwt.expressjwt({
        secret: process.env.SECRET_TOKEN, 
        algorithms: ['HS256']
    }).unless({ 
        path: [
            '/',
            '/api/login',
            '/api/logout', 
            '/api/users', 
            '/api/absences', 
            '/api/holidays',
            '/api/absence_types',
            '/api/deadlines',
            '/api/users/password',
            '/api/resetpass',
        ]
}))

// parse JWT token on exluced paths and paste it to req.auth property
// if expired, tell client he has expired token
// on paths like get users we dont require token, but if it is included
// we check if it is valid, and if not we tell it about client
// on other hand, GET users has no need to be protected BUT
// POST users must be protected, i didnt find option to EXCLUDE only GET with express-jwt
// this is temporary workaround
app.use((req, res, next) => {
    var token = req.headers.authorization
    if(!token) return next()
    if(req.auth) return next()
    try {
        token = token.split(" ")[1]
        jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
            if(err){
                throw err
            }
            req.auth = decoded
            return next()
        });
    }
    catch (err) {
        return next(err)
    }
})

// DUMMY LOGOUT QUERY USEFULL FOR
// LOGOUTING IN APP USING RTK QUERY + TAG INVALIDATORS
app.get('/api/logout', (req, res) => {
    res.end()
})

// EXPORT
app.get("/export", (req, res, next) => {
    try {
        if(!req.auth?.perms?.includes("export")){
            throw new Errors.UnauthorizedActionError("Unsufficient permissions")
        }
        res.download("files/test.csv", (err) => {
            if(err) {
                return next(err)
            }
            res.end()
        })
    } catch (err) {
        return next(err)
    }
})


const routes = [
    'login', 
    'users', 
    'absences', 
    'deadlines', 
    'holidays', 
    'holidays_budget', 
    'absence_types', 
    'resetpass', 
    'tickets'
]

routes.forEach(route => {
    const mw = require(`./routes/${route}`)
    app.use(`/api/${route}`, mw)
})

// Global error handler
app.use(Errors.handler)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})