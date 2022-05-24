const express = require('express');
const router = express.Router();
const absences = require('../database/absences.js');
const Errors = require("../Errors.js")
const { parseISO } = require("date-fns");
const deadlines = require('../database/deadlines.js');
const holidays_budget = require('../database/holidays_budget.js');
// returns empty string if everything OK
// else returns message what is wrong
function checkAbsence(user, absence, deadline, author_budget){
    if(!deadline && ["ABSENCE_ILL", "ABSENCE_HOLIDAY"].includes(absence.key) && !user.perms.includes("bypass_time")){
        return "Pre tento mesiac nebol určený termín zadávania"
    }
    if(!author_budget && absence.key === "ABSENCE_HOLIDAY" && !user.perms.includes("bypass_time")){
        return "Používateľ nemá určený maximalny počet dovoleniek"
    }
    if(user.id != absence.user_id && !user.perms.includes("impersonate")){
        return "You can't add absences for someone else"
    }
    const date = parseISO(absence.date_time)
    if(date < new Date() && !user.perms.includes("bypass_time")){
        return "You can't add absences to the past"
    }
    // 1  - PN | 3 - dovolenka
    if([1, 3, "1", "3"].includes(absence.type) && date.getMonth() === (new Date()).getMonth() && date.getDay() < deadline && !user.perms.includes("bypass_time")){
        return "This type of absences cant be added after deadline"
    }
    const budget_left = author_budget.num - author_budget.used
    if([1, 3, "1", "3"].includes(absence.type) && budget_left-1 < 0 && !user.perms.includes("bypass_time")){
        return "Nedostatok dní dovoleniek"
    }
    return ""
}

// return string, empty means everything ok
function checkAbsencePatch(user, patch, absence, deadline, author_budget){
    if(!deadline && ["ABSENCE_ILL", "ABSENCE_HOLIDAY"].includes(absence.key) && !user.perms.includes("bypass_time")){
        return "Pre tento mesiac nebol určený termín zadávania"
    }
    if(!author_budget && absence.key === "ABSENCE_HOLIDAY" && !user.perms.includes("bypass_time")){
        return "Používateľ nemá určený maximalny počet dovoleniek"
    }

    if('confirmation' in patch){
        if(!user.perms.includes("manage_requests")) {
            return "You dont have permission to manage requests"
        }
        var size = Object.keys(patch).length;
        // 2 položky - ID a nova hodnota pre confirmation
        if(size === 2){
            return ""
        }
    }
    if(user.id != absence.user_id && !user.perms.includes("impersonate")){
        return "You can't edit others absence"
    }
    const date = parseISO(absence.date_time)
    if(date < new Date() && !user.perms.includes("bypass_time")){
        return "You can't edit absence from the past"
    }
    const new_date = parseISO(patch.date_time)
    if(new_date && new_date < new Date() && !user.perms.includes("bypass_time")){
        return "You can't change date time to the past"
    }
    // 1  - PN | 3 - dovolenka
    if(new_date && [1, 3, "1", "3"].includes(patch.type) && date.getMonth() === (new Date()).getMonth() && date.getDay() < deadline && !user.perms.includes("bypass_time")){
        return "This type of absences cant be added after deadline"
    }
    const budget_left = author_budget.num - author_budget.used
    if([1, 3, "1", "3"].includes(patch.type) && patch.type != absence.type && budget_left-1 < 0 && !user.perms.includes("bypass_time")){
        return "Nedostatok dní dovoleniek"
    }
    return ""
}


// return string, empty means everything ok
function checkAbsenceDelete(user, absence, deadline){
    if(!deadline && ["ABSENCE_ILL", "ABSENCE_HOLIDAY"].includes(absence.key) && !user.perms.includes("bypass_time")){
        return "Pre tento mesiac nebol určený termín zadávania"
    }

    if(user.id != absence.user_id && !user.perms.includes("impersonate")){
        return "You can't delete others absence"
    }
    const date = parseISO(absence.date_time)
    if(date < new Date() && !user.perms.includes("bypass_time")){
        return "You can't delete absence from the past"
    }
    if(["ABSENCE_ILL", "ABSENCE_HOLIDAY"].includes(absence.key) && date.getDate() > deadline && !user.perms.includes("bypass_time")){
        return "You can't delete this absence after deadline"
    }
    return ""
}

router.get('/', async (req, res, next) => {
    try {
        const [month, year, userid, rq_only] = [req.query.month, req.query.year, req.query.userid, req.query.rq_only]
        const user = req.auth

        if(!year){
            throw new Errors.MissingArgumentError("YEAR is missing")
        }

        if(rq_only){
            let data;
            data = await absences.getRequestsByYear(year)
            return res.send(data)            
        }

        if(!month){
            throw new Errors.MissingArgumentError("MONTH is missing")
        }

        let data;
        if(!userid){
            data = await absences.getAbsencesByYearMonth(year, month)
        }
        else {
            data = await absences.getAbsencesByYearMonthUser(year, month, userid)
        }

        if(user?.perms?.includes("impersonate")){
            res.send(data)
            return
        }
        data = data.filter(ab => {
            if(ab.public === 0) return false
            if(ab.public === 1 && user) return true
            if(ab.public === 2) return true
            return true
        })
        res.send(data)


    } catch (err) {
        return next(err)
    }
});

router.get('/:absenceId', async (req, res, next) => {
    try {
        const absenceId = req.params.absenceId
        if(!absenceId){
            throw new Errors.MissingArgumentError("absenceId missing")
        }
        
        const arrayWithOneRow = await absences.getAbsenceById(absenceId)
        const data = arrayWithOneRow[0]
        if(!arrayWithOneRow.length || !data){
            throw new Errors.IdMatchNoEntry(`Absence ID ${absenceId} doesn't exist`)
        }
        return res.send(data)

    } catch (err) {
        return next(err)
    }
})

router.post('/',  async(req, res, next) => {
    try {
        const data = req.body
        if(!data || !data.length){
            throw new Errors.BodyRequiredError("No data provided")
        }
        if(!req.auth?.perms){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }
        // START TRANSACTION
        for(let i = 0; i < data.length; i++){
            const absence = data[i]
            const absence_date = parseISO(absence.date_time)
            const deadline = (await deadlines.getDeadlineByYearMonth(absence_date.getFullYear(), absence_date.getMonth()))[0]?.day
            const budget = (await holidays_budget.getUserCurrentBudget(absence.user_id))[0]
            const result_message = checkAbsence(req.auth, absence, deadline, budget)
            if(result_message){
                throw new Errors.UnauthorizedActionError(result_message)
            }
        }
        await absences.insertAbsences(data)
        // END TRANSACITON
        res.end()
    } catch (err) {
        return next(err)
    }
})

router.patch("/:id", async(req, res, next) => {
    try {
        const id = req.params.id;
        if(!id){
            throw new Errors.MissingArgumentError("argument id missing")
        }
        if(!req.auth?.perms){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }
        
        const patch = req.body
        if(!patch || patch === {}){
            throw new Errors.BodyRequiredError("No patch provided")
        }
        patch.id = id
        // START TRANSACTION
        const absence = (await absences.getAbsenceById(id))[0]
        if(!absence){
            throw new Errors.IdMatchNoEntry("Absence not found")
        }
        const absence_date = absence.date_time
        const deadline = (await deadlines.getDeadlineByYearMonth(absence_date.getFullYear(), absence_date.getMonth()))[0]?.day
        const budget = (await holidays_budget.getUserCurrentBudget(absence.user_id))[0]
        const result_message = checkAbsencePatch(req.auth, patch, absence, deadline, budget)

        if(result_message){
            throw new Errors.UnauthorizedActionError(result_message)
        }
        await absences.update(patch)
        // END TRANSACTION
        res.end()
    } catch (err) {
        return next(err)
    }
})

router.delete("/:id", async(req, res, next) => {
    try {
        const id = req.params.id;
        if(!id){
            throw new Errors.MissingArgumentError("argument id missing")
        }   
        
        if(!req.auth?.perms){
            throw new Errors.UnauthorizedActionError("Insufficient permissions")
        }
        //start transaction
        const absence = (await absences.getAbsenceById(id))[0]
        if(!absence){
            throw new Errors.IdMatchNoEntry("Absence not found")
        }

        const absence_date = absence.date_time
        const deadline = (await deadlines.getDeadlineByYearMonth(absence_date.getFullYear(), absence_date.getMonth()))[0]?.day

        const result_message = checkAbsenceDelete(req.auth, absence, deadline)

        if(result_message){
            throw new Errors.UnauthorizedActionError(result_message)
        }
        await absences.delete(id)
        //stop transaction

        res.end()

    } catch (err) {
        return next(err)
    }
})

module.exports = router;
