const query = require('./query.js')

module.exports = {
    getAbsences: () => {
        let SQL = "SELECT * FROM absence"
        return query(SQL, [])
    },
    getAbsencesByYearMonth: (year, month) => {
        let SQL = "SELECT * FROM absence WHERE EXTRACT(YEAR FROM date_time) = ? AND EXTRACT(MONTH FROM date_time) = ?"
        return query(SQL, [year, month])
    },
    getAbsencesByYearMonthUser: (year, month, user) => {
        let SQL = "SELECT * FROM absence WHERE EXTRACT(YEAR FROM date_time) = ? AND EXTRACT(MONTH FROM date_time) = ? AND user_id = ?"
        return query(SQL, [year, month, user])
    },
    insert(data){
        let SQL = "INSERT INTO absence (user_id, date_time, from_time, to_time, description, type, public, confirmation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        query(SQL, [
            data.user_id, 
            data.date_time, 
            data.from_time, 
            data.to_time,
            data.description, 
            data.type, 
            data.public,
            data.confirmation
        ])
    }
}