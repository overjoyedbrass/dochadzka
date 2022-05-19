const query = require('./query.js')

module.exports = {
    getTicketsByYearMonth: (year, month, user_id) => {
        const SQL = "SELECT * FROM tickets WHERE EXTRACT(YEAR FROM from_date) = ? AND EXTRACT(MONTH FROM from_date) = ? AND user_id = ?"
        return query(SQL, [year, month, user_id])
    },

    insertTicket: (ticket) => {
        const SQL = `REPLACE INTO tickets (user_id, from_date, to_date) VALUES (?, ?, ?)`
        return query(SQL, [ticket.user_id, ticket.from_date, ticket.to_date])
    },
}