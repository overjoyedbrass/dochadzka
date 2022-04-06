const query = require('./query.js')

module.exports = {
    getDeadlinesByYear: (year) => {
        const arguments = [year]
        const SQL = "SELECT * FROM deadlines WHERE year = ?"
        return query(SQL, arguments)
    },
    insert: (data) => {
        const arguments = [data.year, data.month, data.day]
        const SQL = "INSERT INTO deadlines VALUES (?, ?, ?)"
        return query(SQL, arguments)
    }
}