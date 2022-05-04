import React from 'react'
import {
    TableBody,
    TableContainer,
    Table,
    TableRow,
    TableCell,
    Paper,
    TableHead,
} from '@mui/material'
import { AbsenceAuthor } from './AbsenceAuthor.js'
import { appTheme } from '../../helpers/themes'
import { absenceTypes } from '../../helpers/helpers'
import { startOfMonth, add, getDay } from 'date-fns'
import { datesSameMonth, datesAreSame } from '../../helpers/helpers'

function getColorForCell(dates,  cycledDate, i, skok){
    return dates.some(d => datesAreSame(d, cycledDate)) ? appTheme.gui.picked: [6, 0].includes((i+skok)%7) ? appTheme.gui.weekend : appTheme.gui.primary
}

const week = [
    'pondelok',
    'utorok',
    'streda',
    'štvrtok',
    'piatok',
    'sobota',
    'nedeľa'
]

export const AbsenceBox = ({absence, funOnClick, empty, day}) => {
    if(empty){
        return (
        <div
            className="absence-box"
            style={{
                background: appTheme.palette.primary.light, 
                color: "white"
            }}
            onClickCapture={(e) => {
                e.nativeEvent.stopPropagation()
                funOnClick(day)
            }}
        >
            Zobraziť všetky
        </div>)
    }
    if(absence.isHoliday){
        return (<div
            className="absence-box" 
            style={{
                background: appTheme.palette.holiday.main,
                color: appTheme.palette.holiday.color,
                cursor: ""
            }}>
            {absence.description}
        </div>)
    }
    return (
        <div 
            className="absence-box" 
            onClickCapture={(e) => {
                e.nativeEvent.stopPropagation()
                funOnClick(absence)
            }}
            style={{
                background: appTheme.gui.absence[absence.type],
                color:      appTheme.text.absence[absence.type]
            }}
        >
            <AbsenceAuthor userId={absence.user_id}/>{" – "}{absenceTypes[absence.type]}
        </div>
    )
}

const CalendarCell = ({isToday, day, absences, functions}) => {  
    const MAX_PER_CELL = 4
    const overflow = absences.length > MAX_PER_CELL
    const show_4th = !overflow && absences.length === MAX_PER_CELL
    return (
        <div 
            className="calendar-cell"
            onMouseDown={(event) => functions.mdown(event, day)}
            onMouseUp={(event) => functions.mup(event)}
            onMouseEnter={(event) => functions.hover(event, day)}
            onDoubleClick={() => functions.dc(day)}
        >
            <span className="title" style={{color: isToday ? "blue" : ""}}>
                { isToday ? `[ ${day} ]` : day }
            </span>

            {absences.map((absence, index) => index < 3 ? 
            (<AbsenceBox key={absence.id ?? index} absence={absence} funOnClick={functions.detail}/>) : null)}
            {show_4th ? <AbsenceBox key={absences[MAX_PER_CELL-1].id} absence={absences[MAX_PER_CELL-1]} funOnClick={functions.detail}/> : null}
            {overflow ? <AbsenceBox day={day} empty={true} funOnClick={functions.showMore} /> : null }
            
        </div>
    ) 
}


export const CalendarDisplay = ({selectedDates, viewDate, absences, controlFunctions}) => {
    const dnes = new Date()
    let firstRow = []
    //hlavičky stlpcov
    week.forEach((nazov, index) => {
        firstRow.push((
            <TableCell
                variant="head"
                key={index} 
                className="first-row-table-cell"
                sx={{
                    borderColor: appTheme.gui.border,
                    verticalAlign: "top",
                }}
            >
                {nazov}
            </TableCell>
        ))
    })
    let rows = []

    //riadok tabuľky
    let row = [] 
    //premenna datumu v cykle
    var cycledDate = startOfMonth(viewDate)
    const skok = getDay(cycledDate) ? getDay(cycledDate)-1 : 6
    //prazdne bunky pred prvym dňom
    for(let i = 0; i < skok; i++){
        row.push((<TableCell key={skok+i}/>))
    }
    //všetky zvyšné bunky
    while(cycledDate.getMonth() === viewDate.getMonth()){
        let i = cycledDate.getDate()
        let bgColor = getColorForCell(selectedDates, cycledDate, i, skok)
        row.push((
        <TableCell
            key={cycledDate.getDay()+20}
            sx={{
                borderColor: appTheme.gui.border,
                backgroundColor: bgColor,
                padding: "0.5em"
            }}
        >
            <CalendarCell
                isToday={dnes.getDate() === i && datesSameMonth(dnes, viewDate)} 
                day={i} 
                absences={absences[i]} 
                functions={controlFunctions}
            />
        </TableCell>
        ))
        if((i+skok)%7 === 0){
            rows.push((<TableRow key={rows.length}>{row}</TableRow>))
            row = []
        }
        cycledDate = add(cycledDate, {days: 1})
    }
    rows.push((<TableRow key={rows.length}>{row}</TableRow>))

    return (
        <TableContainer component={Paper}
            onMouseUp={() => controlFunctions.setHovering(false)}
            sx={{dragable:"false"}}
        >
            <Table 
                stickyHeader
                aria-label="calendar" 
                sx={{tableLayout:"fixed"}}
            >
                <TableHead>
                    <TableRow key={0}>{firstRow}</TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </TableContainer>
    )
}