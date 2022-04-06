import React from 'react'
import {
    TableBody,
    TableContainer,
    Table,
    TableRow,
    TableCell,
    Paper
} from '@mui/material'
import { AbsenceAuthor } from './AbsenceAuthor.js'
import { mainTheme } from '../../helpers/themes'
import { formatFromTo } from '../../helpers/helpers'
import { startOfMonth, format, add, getDay } from 'date-fns'
import { sk } from 'date-fns/locale'
import { datesSameMonth, datesAreSame } from '../../helpers/helpers'

function getColorForCell(dates,  cycledDate, i, skok){
    return dates.some(d => datesAreSame(d, cycledDate)) ? mainTheme.gui.picked: [6, 0].includes((i+skok)%7) ? mainTheme.gui.weekend : mainTheme.gui.primary
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

const AbsenceBox = ({absence, funOnClick}) => {
    return (
        <div 
            className="absence-box" 
            onClickCapture={(e) => {
                e.nativeEvent.stopPropagation()
                funOnClick(absence)
            }}
            style={{background: mainTheme.palette.primary.light, whiteSpace: "pre-wrap"}}
        >
            <AbsenceAuthor userId={absence.user_id}/>
            {' - '}
            {formatFromTo(absence.from_time, absence.to_time)}
        </div>
    )
}

const CalendarCell = ({isToday, day, absences, functions}) => {        
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

            <div 
                className="absences-container"
            >
                {absences.map((absence) => 
                (<AbsenceBox key={absence.id} absence={absence} funOnClick={functions.edit}/>))
                }
            </div>
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
                    borderColor: mainTheme.gui.border,
                    verticalAlign: "top",
                }}
            >
                {nazov}
            </TableCell>
        ))
    })
    let rows = [(<TableRow key={0}>{firstRow}</TableRow>)]

    //riadok tabuľky
    let row = [] 
    //premenna datumu v cykle
    var cycledDate = startOfMonth(viewDate)
    const skok = getDay(cycledDate)-1
    //prazdne bunky pred prvym dňom
    for(let i = 1; i <= skok; i++){
        row.push((<TableCell key={i%7}/>))
    }
    //všetky zvyšné bunky
    while(cycledDate.getMonth() === viewDate.getMonth()){
        let i = cycledDate.getDate()
        let bgColor = getColorForCell(selectedDates, cycledDate, i, skok)
        row.push((
        <TableCell
            key={(i+skok)%7}
            sx={{
                borderColor: mainTheme.gui.border,
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
                aria-label="calendar" 
                sx={{tableLayout:"fixed"}}
            >
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </TableContainer>
    )
}