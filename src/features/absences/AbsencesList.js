import React from 'react-redux'
import { AbsenceAuthor } from './AbsenceAuthor.js'

import { formatFromTo, myDateFormat, absenceTypes } from '../../helpers/helpers'

import { 
    TableBody, TableCell, TableContainer, Table, TableRow, Paper, IconButton
} from '@mui/material'
import { Edit, Delete} from '@mui/icons-material'
import './AbsenceList.css'

function HolidayRow({hd, rowSpan}){
    return (<TableRow
                sx={{
                    backgroundColor: "holiday.main"
                }}
            >
                <TableCell rowSpan={rowSpan} sx={{color: "holiday.color", backgroundColor: "white"}}>
                    <b>{myDateFormat(hd.date_time)}</b>
                </TableCell>
                <TableCell colSpan={3} sx={{color: "holiday.color"}}>
                    <b>{ hd.description }</b>
                </TableCell>
                <TableCell></TableCell>
        </TableRow>)
}

export const AbsencesList = ({absences, userId, showDetail}) => {    
    function edit(e){
        e.stopPropagation()
    }
    function deletee(e){
        e.stopPropagation()
    }

    const rows = [] 
    for(const [day, absencesByDay] of Object.entries(absences)){
        if(absencesByDay.length === 0)
            continue;
        for(let i = 0; i < absencesByDay.length; i++){
            const absence = absencesByDay[i]
            const firstInRow = i === 0
            const numberOfRows = absencesByDay.length
            const userSpecified = userId ? true : false
            if(!absence) continue;
            rows.push(
                i === 0 && absence.isHoliday ? <HolidayRow hd={absence} rowSpan={numberOfRows} key={ day } /> :
                <TableRow 
                    key={absence.id}
                    onClick={() => showDetail(absence)}
                >
                    {!firstInRow ? null :
                    <TableCell 
                        sx={{verticalAlign: "top", backgroundColor: "white"}} 
                        rowSpan={numberOfRows}
                    >
                        { myDateFormat(new Date(absence.date_time)) }
                    </TableCell>}

                    {userSpecified ? null : 
                    (<TableCell>
                        <b><AbsenceAuthor userId={absence.user_id}/></b>
                    </TableCell>)}
                    <TableCell>{ absenceTypes[absence.type] }</TableCell>
                    <TableCell>{ formatFromTo(absence.from_time, absence.to_time) }</TableCell>
                    <TableCell>{
                        true ? 
                        <>
                        <IconButton color="primary" onClick={edit}><Edit /></IconButton>
                        <IconButton color="error" onClick={deletee}><Delete /></IconButton>
                        </> : null
                    }</TableCell>
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