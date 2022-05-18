const query = require('./query.js')

module.exports = {
    getPerms: (role) => {
        const SQL = 'SELECT perms.perm FROM perms WHERE role = ?'
        return query(SQL, [role])
    }
}
