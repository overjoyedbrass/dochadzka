import React from 'react'
import { AbsenceCell } from './AbsenceCell'

export const CalendarCell = ({isToday, day, absences, fun}) => {
    return (
        <div style={{minHeight: "10em", userSelect: "none"}}>
            {isToday ? 
            (<b><font color={isToday ? "blue" : ""}>[{day}.]</font></b>) : 
            (<b>{day}</b>)}
            <div style={{overflow: "hidden"}}>
                {absences.map((ab) => 
                (<AbsenceCell key={ab.id} ab={ab} fun={fun}/>))
                }
            </div>
        </div>
    )
}