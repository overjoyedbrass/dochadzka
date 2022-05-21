import React from 'react'
import { AbsenceAuthor } from './AbsenceAuthor.js'

import { formatFromTo, myDateFormat, isAbsenceEditable } from '../../helpers/helpers'
import { useDeleteAbsenceMutation, useGetAbsenceTypesQuery } from '../api/apiSlice.js'
import { ConfirmDialog } from '../../components/ConfirmDialog.js'
import { toast } from 'react-toastify'
import { 
    TableBody, TableCell, TableContainer, Table, TableRow, Paper, IconButton
} from '@mui/material'
import { Edit, Delete} from '@mui/icons-material'
import './AbsenceList.css'
import { useSelector } from 'react-redux'
import { selectLoggedUser } from '../auth/authSlice.js'

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

export const AbsencesList = ({absences, userId, showDetail, openEdit}) => {
    const [absenceToDelete, setAbsenceToDelete] = React.useState(null)
    const [deleteAbsence, {}] = useDeleteAbsenceMutation()
    const {data: absenceTypes={}} = useGetAbsenceTypesQuery()

    const user = useSelector(selectLoggedUser)
    
    async function submitDelete(){
        try{
            await deleteAbsence(absenceToDelete.id).unwrap()
            toast("Neprítomnosť odstránená", {type:"success", autoClose: 1000})
            setAbsenceToDelete(null)
        }    
        catch(err){
            toast("Neprítomnosť sa nepodarilo odstrániť", {type: "error"})
        }
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
                    <TableCell>{ absenceTypes[absence.type]?.value }</TableCell>
                    <TableCell>{ formatFromTo(absence.from_time, absence.to_time) }</TableCell>
                    <TableCell>{
                        isAbsenceEditable(absence, user) ? 
                        <>
                        <IconButton onClick={(e) => {
                            e.stopPropagation()
                            openEdit(absence)
                        }} color="primary"><Edit /></IconButton>
                        <IconButton onClick={(e) => {
                            e.stopPropagation()
                            setAbsenceToDelete(absence)
                        }} color="error" ><Delete /></IconButton>
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
            <ConfirmDialog
                open={absenceToDelete ? true : false}
                question="Chcete skutočne odstrániť neprítomnosť?"
                noText="Zrušiť"
                yesText="Odstrániť"
                noAction={() => setAbsenceToDelete(null)}
                yesAction={submitDelete}
        />
        </div>
    )
}