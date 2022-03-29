const query = require('./query.js')

module.exports = {
    getUsers: () => {
        const SQL = 'SELECT id, username, name, surname, email, status, personal_id FROM users'
        return query(SQL, [])
    },
    getUserById: (id) => {
        const SQL = 'SELECT id, username, name, surname, email FROM users WHERE id = ?'
        return query(SQL, [id])
    },
    getUserByUsername: (username) => {
        const SQL = 'SELECT id, personal_id, username, password, name, surname, email, status FROM users WHERE username = ?'
        return query(SQL, [username])
    }
}