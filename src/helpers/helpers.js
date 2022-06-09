import { format, add } from 'date-fns'
import { parseISO } from 'date-fns/esm'
import {sk} from 'date-fns/locale'
import { BASE_URL } from '../config'
const mesiace = ['Január', 'Február', 'Marec', 'Apríl','Máj', 'Jún', 'Júl', 'August','September','Október','November','December']

export const isAbsenceEditable = (absence, user) => {
    if(!absence) return false
    if(absence.user_id !== user.id && !user.perms.includes("impersonate")){
        return false
    }
    const date = parseISO(absence.date_time)
    if(date < new Date() && !user.perms.includes("bypass_time")){
        return false
    }
    return true
}

export const downloadExport = async (token, month, year) => {
    const response = await fetch(`${BASE_URL}0/export?month=${month}&year=${year}`, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    const data = await response.blob()
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(data);
    a.download = "export"
    a.click()
}

// return distance between dates by work dates
function datesDistance(date1, date2){
    var start = date1
    var diff = 0
    while(start < date2){
       start = add(start, {days: 1})
       if(![0, 6].includes(start.getDay())){
            diff += 1
       }
    }
    return diff
}

export function getTickets(absences, userId){
    const tickets = []
    const userHolidays = absences.filter(ab => ab.user_id === userId && ab.type === 3)
    userHolidays.sort((a, b) => parseISO(a.date_time) - parseISO(b.date_time))
    var start = null
    var end = null
    for(let i = 0; i < userHolidays.length; i++){
        const cur = parseISO(userHolidays[i].date_time)
        if(start === null){
            start = cur
            end = start
            continue
        }
        const dist = datesDistance(end, cur)
        if(dist > 1){
            tickets.push({from_date: start, to_date: end, user_id: userId})
            start = cur
            end = cur
            continue
        }
        end = cur
    }
    if(start && end)
        tickets.push({from_date: start, to_date: end, user_id: userId})
    return tickets
}

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export function formatFromTo(from, to){
    if(isFullDay(from, to)){
        return "Celý deň"
    }
    return from?.substring(0, from.length-3) + " - " + to?.substring(0, to.length-3)
}
export function isFullDay(from, to){
    return from === "08:00:00" && to === "16:00:00"
}

export function myDateFormat(date){
    return format(date ?? new Date(), "d. MMMM yyyy", {locale: sk})
}

export function displaySelectedMonth(date){
    return mesiace[date.getMonth()] + " " + date.getFullYear()
}

export function disableSelection() {
    if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection) {  // IE?
        document.selection.empty();
    }
}

export function datesSameMonth(d1, d2){
    return d1.getYear() === d2.getYear() && d1.getMonth() === d2.getMonth()
}


export function datesAreSame(d1, d2){
    return d1.getYear() === d2.getYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

export function lastDayOfMonth(month, year){
    var lastDay = new Date(year, month, 0);
    return lastDay.getDate()
}