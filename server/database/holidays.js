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
        const SQL = "INSERT INTO holidays VALUES(NULL, ?, ?)"
        return query(SQL, [data.date_time, data.description])
    },
    delete: (id) => {
        const SQL = "DELETE FROM holidays WHERE id = ?"
        return query(SQL, [id])
    },
    update(id, patch){
        const SQL = 
           `UPDATE holidays
            SET date_time = COALESCE(?, date_time),
                description = COALESCE(?, description)
            WHERE id = ?`;
        return query(SQL, [
            patch.date_time,
            patch.description,
            id
        ])
    }
}