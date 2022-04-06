const query = require("./query.js")

module.exports = {
    getHolidaysBudgetByYear: function(year){
        const SQL = "SELECT * FROM holidays_budget WHERE year = ?"
        return query(SQL, [year])
    }
}