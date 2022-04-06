const query = require('./query.js')
const format = require('date-fns').format

module.exports = {
    getHolidaysByYear: (year) => {
        const SQL = "SELECT * FROM holidays WHERE EXTRACT(YEAR FROM date_time) = ? ORDER BY date_time"
        return query(SQL, [year])
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