require("dotenv").config();

const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT;

const bodyParser = require('body-parser');
const jwt = require("express-jwt");

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

//jwt middleware
app.use(
    jwt.expressjwt({secret: process.env.SECRET_TOKEN, algorithms: ['HS256']}).unless({ path: ['/api/login','/api/logout', '/api/users', '/api/absences', '/api/holidays']})
)

// DUMMY LOGOUT QUERY USEFULL FOR
// LOGOUTING IN APP USING RTK QUERY + TAG INVALIDATORS
app.get('/api/logout', (req, res) => {
    res.end()
})

const test = null ?? {}

const routes = ['login', 'users', 'absences', 'deadlines', 'holidays', 'holidays_budget']
routes.forEach(route => {
    const mw = require(`./routes/${route}`)
    app.use(`/api/${route}`, mw)
})

// custom error responses after catching an error
app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).send({message: "JWT Token expired", token_expired: err.code === "invalid_token"});
    } else {
      next(err);
    }
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})