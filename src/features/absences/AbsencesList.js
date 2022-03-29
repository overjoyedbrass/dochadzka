import React from 'react-redux'
import { AbsenceAuthor } from './AbsenceAuthor.js'

import { formatFromTo, myDateFormat, absenceTypes } from '../../helpers/helpers'

import { 
    TableBody, TableCell, TableContainer, Table, TableRow, Paper
} from '@mui/material'

import './AbsenceList.css'



export const AbsencesList = ({absences, userId}) => {
    const rows = []
    for(const [day, absencesByDay] of Object.entries(absences)){
        if(absencesByDay.length === 0)
            continue;
        for(let i = 0; i < absencesByDay.length; i++){
            const absence = absencesByDay[i]
            const firstInRow = i === 0
            const numberOfRows = absencesByDay.length
            const userSpecified = userId ? true : false
            rows.push(
                <TableRow key={absence.id}>
                    {firstInRow ? (<TableCell sx={{verticalAlign: "top"}} rowSpan={numberOfRows}>{myDateFormat(new Date(absence.date_time))}</TableCell>) : null}
                    {userSpecified ? null : (<TableCell><b><AbsenceAuthor userId={absence.user_id}/></b></TableCell>)}
                    <TableCell>{absenceTypes[absence.type]}</TableCell>
                    <TableCell>{formatFromTo(absence.from_time, absence.to_time)}</TableCell>
                </TableRow>
            )
        }
    }
    if(rows.length === 0){
        return (
            <div className="list">
                Žiadne záznamy . . .
            </div>
        )
    }
    return (
        <div className="list">
            <TableContainer component={Paper}>
                <Table aria-label="absences table">
                    <TableBody>
                        {rows}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}