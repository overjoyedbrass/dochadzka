const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

pool.getConnection((err, connection) => {
    if(err)
    throw err;
    console.log("Database connected")
    connection.release()
})

module.exports = pool;

