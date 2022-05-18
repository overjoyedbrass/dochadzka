const query = require('./query.js')

module.exports = {
    getDeadlinesByYear: (year) => {
        const arguments = [year]
        const SQL = "SELECT * FROM deadlines WHERE year = ?"
        return query(SQL, arguments)
    },
    getDeadlineByYearMonth: (year, month) => {
        const arguments = [year, month]
        const SQL = "SELECT day FROM deadlines WHERE year = ? AND month = ?;"
        return query(SQL, arguments)
    },
    replace: (year, data) => {
        const MONTHS_COUNT  = 12
        const arguments = []
        for(let month = 1; month <= MONTHS_COUNT; month++){
            arguments.push(year)
            arguments.push(month)
            arguments.push(data[String(month)])
        }
        const values = Array(MONTHS_COUNT).fill("(?, ?, ?)").join(", ")
        const SQL = `REPLACE INTO deadlines VALUES ${values}`

        return query(SQL, arguments)
    }
}