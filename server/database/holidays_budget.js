const query = require("./query.js")

module.exports = {


    getHolidaysBudgetByYear: function(year){
        const SQL = 
        `SELECT hb.user_id, used.used, hb.num
        FROM holidays_budget hb 
        JOIN 
        (SELECT user_id, count(user_id) as used FROM absence WHERE TYPE = 3 AND EXTRACT(YEAR FROM date_time) = ? GROUP BY user_id) used 
        ON 
        hb.user_id = used.user_id 
        WHERE year = ?`
        return query(SQL, [year, year])
    },




    getUserCurrentBudget: function(user_id){
        const SQL =
        `SELECT budget.user_id, budget.num, used.used
        FROM holidays_budget as budget
        LEFT JOIN 
        (SELECT user_id, count(*) as used FROM absence WHERE TYPE = 3 AND EXTRACT(YEAR FROM date_time) = EXTRACT(YEAR FROM NOW()) AND user_id = ?) used
        ON budget.user_id = used.user_id
        WHERE year = EXTRACT(YEAR FROM NOW())
        AND budget.user_id = ?`
        return query(SQL, [user_id, user_id])
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