const query = require('./query.js')

module.exports = {
    getUsers: () => {
        const SQL = 'SELECT id, username, name, surname, email, status, personal_id FROM users'
        return query(SQL, [])
    },

    getUserById: (id, passwordOnly=false) => {
        const SQL = passwordOnly ? 
        "SELECT password FROM users WHERE id = ?" : 
        'SELECT id, username, name, surname, email FROM users WHERE id = ?'
        return query(SQL, [id])
    },

    getUserByUsername: (username) => {
        const SQL = "SELECT id, personal_id, username, password, name, surname, email, status FROM users WHERE username = ?";
        return query(SQL, [username])
    },

    updateUser: (data) => {
        const SQL = 
           `UPDATE users 
            SET username = COALESCE(?, username),
                password = COALESCE(?, password),
                name = COALESCE(?, name),
                surname = COALESCE(?, surname),
                email = COALESCE(?, email),
                status = COALESCE(?, status)
            WHERE id = ?`;
        return query(SQL, [data.username, data.newPassword, data.name, data.surname, data.email, data.status, data.id])
    },

    updateLastLogin: (id) => {
        const SQL = "UPDATE users SET last_login = NOW() WHERE id = ?"
        return query(SQL, [id])
    },

    insertUser: (data) => {
        const SQL =
            `INSERT INTO users(personal_id, username, password, name, surname, email, status)
            VALUES
            (?, ?, ?, ?, ?, ?, ?)`
        return query(SQL, [data.personal_id, data.username, data.password, data.name, data.surname, data.email, data.status])
    }
}