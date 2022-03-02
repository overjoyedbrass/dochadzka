require("dotenv").config();

var cors = require('cors');
var express = require('express');
var app = express()
var port = 3001

var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// app use cors
app.use(cors())

// jwt middleware

const index = require('./routes/index')
app.use('/', index)

const routes = ['users', 'absences', 'deadlines', 'holidays', 'holidays_budget']
routes.forEach(route => {
    const mw = require(`./routes/${route}`)
    app.use(`/api/${route}`, mw)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})