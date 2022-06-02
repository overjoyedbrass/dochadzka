const query = require('./query.js')

module.exports = {
    getAbsences: () => {
        let SQL = 
        `SELECT * FROM absence 
        LEFT JOIN absence_types ON absence.type = absence_types.type_id`
        return query(SQL, [])
    },
    getAbsenceById: (id, connection=null) => {
        let SQL = 
        `SELECT * FROM absence 
        LEFT JOIN absence_types ON absence.type = absence_types.type_id
        WHERE id = ?`
        return query(SQL, [id], connection)
    },
    getAbsencesByYearMonth: (year, month) => {
        let SQL = 
        `SELECT * FROM absence 
        LEFT JOIN absence_types ON absence.type = absence_types.type_id
        WHERE EXTRACT(YEAR FROM date_time) = ? 
        AND EXTRACT(MONTH FROM date_time) = ?`
        return query(SQL, [year, month])
    },
    getAbsencesByYearMonthUser: (year, month, user) => {
        let SQL = 
        `SELECT * FROM absence
        LEFT JOIN absence_types ON absence.type = absence_types.type_id
        WHERE EXTRACT(YEAR FROM date_time) = ? 
        AND EXTRACT(MONTH FROM date_time) = ? AND user_id = ?`
        return query(SQL, [year, month, user])
    },
    getRequestsByYear: (year) => {
        let SQL = 
        `SELECT * FROM absence
        LEFT JOIN absence_types ON absence.type = absence_types.type_id
        WHERE EXTRACT(YEAR FROM date_time) = ? 
        AND (absence_types.key = "ABSENCE_TRAVEL" OR absence_types.key = "ABSENCE_WORKFROMHOME") 
        ORDER BY date_time DESC`
        return query(SQL, [year])
    },
    insertAbsences(rows, connection=null){
        const arguments = []
        rows.forEach(r => {
            arguments.push(r.user_id)
            arguments.push(r.date_time)
            arguments.push(r.from_time)
            arguments.push(r.to_time)
            arguments.push(r.description)
            arguments.push(r.type)
            arguments.push(r.public)
            arguments.push(r.confirmation)
        })
        const empty_values = Array(rows.length).fill("(?, ?, ?, ?, ?, ?, ?, ?)").join(", ")
        let SQL = `INSERT INTO absence (user_id, date_time, from_time, to_time, description, type, public, confirmation) VALUES ${empty_values}`
        return query(SQL, arguments, connection=connection)
    },
    update(data, connection=null){
        const SQL = 
           `UPDATE absence
            SET from_time = COALESCE(?, from_time),
                to_time = COALESCE(?, to_time),
                description = COALESCE(?, description),
                public = COALESCE(?, public),
                type = COALESCE(?, type),
                confirmation = COALESCE(?, confirmation)
            WHERE id = ?`;
        return query(SQL, [
            data.from_time,
            data.to_time,
            data.description,
            data.public,
            data.type,
            data.confirmation,
            data.id
        ], connection)
    },
    delete(id, connection){
        const SQL = "DELETE FROM absence WHERE id = ?"
        return query(SQL, [id], connection)
    }
}