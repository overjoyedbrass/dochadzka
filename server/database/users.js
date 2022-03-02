const query = require('./query.js')

module.exports = {
    getUsers: () => {
        const SQL = 'SELECT id, username, name, surname, email FROM users'
        return query(SQL, [])
    },
    getUserById: (id) => {
        const SQL = 'SELECT id, username, name, surname, email FROM users WHERE id = ?'
        return query(SQL, [id])
    }
}