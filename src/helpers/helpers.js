import {format} from 'date-fns'
import {sk} from 'date-fns/locale'

const mesiace = ['Január', 'Február', 'Marec', 'Apríl','Máj', 'Jún', 'Júl', 'August','September','Október','November','December']

export const absenceTypes = [
    "Dovolenka",
    "Práca doma",
    "Práceneschopnosť",
    "Pracovná cesta",
    "Materská dovolenka",
    "Rodičovská dovolenka",
    "Iná neprítomnosť"
]

export function formatFromTo(from, to){
    if(isFullDay(from, to)){
        return "Celý deň"
    }
    return from.substring(0, from.length-3) + " - " + to.substring(0, to.length-3)
}
export function isFullDay(from, to){
    return from === "08:00:00" && to === "16:00:00"
}

export function myDateFormat(date){
    return format(date, "d. MMMM yyyy", {locale: sk})
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