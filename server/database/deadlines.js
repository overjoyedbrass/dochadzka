const query = require('./query.js')

module.exports = {
    getDeadlineByYearMonth: (year, month) => {
        const arguments = [year, month]
        const SQL = "SELECT * FROM deadlines WHERE year = ? AND month = ?"
        return query(SQL, arguments)
    },
    insert: (data) => {
        const arguments = [data.year, data.month, data.day]
        const SQL = "INSERT INTO deadlines VALUES (?, ?, ?)"
        return query(SQL, arguments)
    }
}