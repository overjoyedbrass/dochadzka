const query = require("./query.js")

module.exports = {
    getHolidaysBudgetByUser: function(userId){
        const SQL = "SELECT * FROM holidays_budget WHERE user_id = ?"
        return query(SQL, [userId])
    }
}