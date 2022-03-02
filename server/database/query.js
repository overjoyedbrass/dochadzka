const db = require('./connection.js')

module.exports = function query(SQL, arguments){
    return new Promise((resolve, reject) => {
        db.query(SQL, arguments, (err, rows) => {
            if (err) {
                return reject(err)
            }
            return resolve(rows)
        })
    })
}