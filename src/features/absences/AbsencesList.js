import React, { useSelector } from 'react-redux'

import { useState } from 'react'

import { Spinner } from '../../components/Spinner'
import { useGetAbsencesQuery } from '../api/apiSlice'
import { AbsenceAuthor } from './AbsenceAuthor.js'

import { sub, add } from 'date-fns'
import { formatFromTo, myDateFormat, displaySelectedMonth, absenceTypes } from '../../helpers/helpers'
import { selectCurrentUser } from '../users/userSlice'

import { 
    Button,
    TableBody, TableCell, TableContainer, Table, TableRow, Paper
} from '@mui/material'


const GroupedAbsenceRow = ({absence, firstInRow, userSpecified, numberOfRows}) => {
    return (
    <TableRow>
        {firstInRow ? (<TableCell sx={{verticalAlign: "top"}} rowSpan={numberOfRows}>{myDateFormat(new Date(absence.date_time))}</TableCell>) : null}
        {userSpecified ? null : (<TableCell><b><AbsenceAuthor userId={absence.user_id}/></b></TableCell>)}
        <TableCell>{absenceTypes[absence.type]}</TableCell>
        <TableCell>{formatFromTo(absence.from_time, absence.to_time)}</TableCell>
        <TableCell>{absence.description}</TableCell>
    </TableRow>
    )
}

const AbsencesListFiltered = ({date, userId}) => {
    console.log("USERID", userId)
    const {
        data: absences=[],
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        isFetching
    } = useGetAbsencesQuery({year: date.getFullYear(), month: date.getMonth(), userid: userId})

    const groupedAbsences = {}
    for(let i = 1; i <= 31; i++){
        groupedAbsences[i] = []
    }
    absences.forEach(absence => {
        const datum = new Date(absence.date_time);
        groupedAbsences[datum.getDate()].push(absence);
    });

    let content
    if(isLoading){
        content = <Spinner text="Loading..."/>
    } else if (isSuccess){
        if(isFetching){
            content = <Spinner text="Loading..."/>
        }
        else{
            const rows = []
            for(const [day, gAbsences] of Object.entries(groupedAbsences)){
                if(gAbsences.length === 0)
                    continue;
                for(let i = 0; i < gAbsences.length; i++){
                    const absnc = gAbsences[i]
                    rows.push(<GroupedAbsenceRow key={absnc.id+day} absence={absnc} numberOfRows={gAbsences.length} firstInRow={i === 0} userSpecified={userId}/>)
                }
            }
            content = rows.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table aria-label="absences table">
                        <TableBody>
                            {rows}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (<p>{"Žiadne záznamy"}</p>)
        }
    } else if(isError){
        console.log('Chyba', error)
        content = <div> Chyba: {error.status}</div>
    }
    
    return (
        <div>
            <Button onClick={refetch}>Refetch</Button>
            {content}
        </div>
    )
}


export const AbsencesList = () => {
    const userId = useSelector(selectCurrentUser)

    const [viewDate, setViewDate] = useState(new Date())
    const subMonth = () => {
        setViewDate(sub(viewDate, {months: 1}))
    }
    const addMonth = () => {
        setViewDate(add(viewDate, {months: 1}))
    }
    

    return (
        <section className="absence-list">
            <Button variant="outlined" onClick={() => setViewDate(new Date())}>Dnes</Button>
            <Button onClick={subMonth}>{"<"}</Button>
            <Button onClick={addMonth}>{">"}</Button>
            <b>{displaySelectedMonth(viewDate)}</b>
            <AbsencesListFiltered date={viewDate} userId={userId ? userId : 0}/>
        </section>
    )
}