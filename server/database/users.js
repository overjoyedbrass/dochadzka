const query = require('./query.js')

module.exports = {
    getUsers: () => {
        const SQL = 'SELECT id, username, name, surname, email, status, personal_id FROM users'
        return query(SQL, [])
    },

    getUserById: (id, passwordOnly) => {
        const SQL = passwordOnly ? 
        "SELECT password, token FROM users WHERE id = ?" : 
        'SELECT id, username, name, surname, email FROM users WHERE id = ?'
        return query(SQL, [id])
    },

    getUserByUsername: (username) => {
        const SQL = "SELECT id, personal_id, username, password, name, surname, email, status FROM users WHERE username = ?";
        return query(SQL, [username])
    },
    
    getUserByEmail: (email) => {
        const SQL = "SELECT id FROM users WHERE email = ?"
        return query(SQL, [email])
    },

    updateUser: (id, patch) => {
        const SQL = 
           `UPDATE users 
            SET username = COALESCE(?, username),
                password = COALESCE(?, password),
                name = COALESCE(?, name),
                surname = COALESCE(?, surname),
                email = COALESCE(?, email),
                status = COALESCE(?, status),
                token = COALESCE(?, token)
            WHERE id = ?`;
        return query(SQL, [patch.username, patch.password, patch.name, patch.surname, patch.email, patch.status, patch.token, id])
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