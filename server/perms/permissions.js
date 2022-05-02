// 0 - Deaktivovaný 
// 1 - Používateľ
// 2 - Administrátor
// 3 - Sekretárka
// 4 - Vedúci katedry

function getPermissions(role){
    return {
        user_managment:         [2, 3].includes(role),
        absence_edit_others:    role === 3,
        make_export:            role === 3,
        edit_deadlines:         role === 3,
        edit_holidays:          role === 3,
        edit_budgets:           role === 3,
        manage_requests:        role === 4,
        bypass_time:            role === 3,
    }
}

module.exports = getPermissions