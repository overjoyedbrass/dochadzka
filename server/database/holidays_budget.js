const query = require("./query.js")

module.exports = {
    getHolidaysBudgetByYear: function(year){
        const SQL = "SELECT * FROM holidays_budget WHERE year = ?"
        return query(SQL, [year])
    },
    getUserCurrentBudget: function(user_id){

    },
    replaceHolidaysBudgetsWithYear(year, rows){
        const arguments = []
        rows.forEach(r => {
            r.forEach(e => arguments.push(e))
        })
        const empty_values = Array(rows.length).fill("(?, ?, ?)").join(", ")
        const SQL = `REPLACE INTO holidays_budget VALUES ${empty_values}`
        return query(SQL, arguments)
    }
    /*
    SELECT hb.user_id, used.used
    FROM holidays_budget hb 
    JOIN 
    (SELECT user_id, count(user_id) as used FROM absence WHERE TYPE = 1 AND EXTRACT(YEAR FROM date_time) = 2021 GROUP BY user_id) used 
    ON 
    hb.user_id = used.user_id 
    WHERE year = 2021;
    */
}