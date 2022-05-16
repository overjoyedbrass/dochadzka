const query = require('./query.js')

module.exports = {
    getPerms: (role) => {
        const SQL = 'SELECT perms.key FROM perms WHERE role = ?'
        return query(SQL, [role])
    }
}
