const query = require('./query.js')

module.exports = {
    getAbsenceTypes: () => {
        let SQL = 
        `SELECT * FROM absence_types`
        return query(SQL, [])
    }
}