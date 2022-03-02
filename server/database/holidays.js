const query = require('./query.js')
const format = require('date-fns').format

module.exports = {
    getHolidaysByYearMonth: (year, month) => {
        const SQL = "SELECT * FROM holidays WHERE EXTRACT(YEAR FROM date_time) = ? AND EXTRACT(MONTH FROM date_time) = ?"
        return query(SQL, [year, month])
    },
    getHolidays: () => {
        const SQL = "SELECT * FROM holidays"
        return query(SQL, [])
    },
    insert: (data) => {
        const SQL = "INSERT INTO holidays VALUES(null, ?, ?)"
        return query(SQL, [data.date_time, data.description])
    }
}