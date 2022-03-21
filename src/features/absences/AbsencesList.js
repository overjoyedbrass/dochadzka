import React, { useSelector } from 'react-redux'

import { useState } from 'react'

import { Spinner } from '../../components/Spinner'
import { useGetAbsencesQuery } from '../api/apiSlice'
import { AbsenceAuthor } from './AbsenceAuthor.js'

import { sub, add } from 'date-fns'
import { formatFromTo, myDateFormat, absenceTypes } from '../../helpers/helpers'
import { UserList } from '../users/UserList.js'
import { DateController } from '../../components/DateController'
import { selectLoggedUser } from '../auth/authSlice.js'

import { 
    Button,
    TableBody, TableCell, TableContainer, Table, TableRow, Paper
} from '@mui/material'

import './AbsenceList.css'

export const AbsencesList = () => {
    const loggedUser = useSelector(selectLoggedUser)
    const [viewDate, setViewDate] = useState(new Date())
    const [userId, setUserId] = useState(loggedUser?.id ?? "")

    return (
        <div className="absence-list">
            <UserList selected={userId} onSelect={setUserId}/>
            <div className="list-wrapper">
                <div style={{display: "flex"}}>
                    <DateController viewDate={viewDate} onChange={(date) => setViewDate(date)} />
                    {loggedUser && userId !== loggedUser.id ? 
                    <Button 
                        variant="outlined"
                        onClick={() => setUserId(loggedUser.id)}
                        sx={{marginRight: "0.2em"}}
                    >
                        Zobraziť moje
                    </Button> : null}
                </div>
                <AbsencesDisplayer date={viewDate} userId={userId} />
            </div>
        </div>
    )
}

const AbsencesDisplayer = ({date, userId}) => {
    const {
        data: absences=[],
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        isFetching
    } = useGetAbsencesQuery({year: date.getFullYear(), month: date.getMonth(), userid: userId})

    const absGroupedByDay = {}
    for(let i = 1; i <= 31; i++){
        absGroupedByDay[i] = []
    }
    absences.forEach(absence => {
        const datum = new Date(absence.date_time);
        absGroupedByDay[datum.getDate()].push(absence);
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
            for(const [day, gAbsences] of Object.entries(absGroupedByDay)){
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
        // console.log('Chyba', error)
        content = <div> Chyba: {error.status}</div>
    }
    
    return (
        <div className="list">
            {content}
        </div>
    )
}

const GroupedAbsenceRow = ({absence, firstInRow, userSpecified, numberOfRows}) => {
    return (
    <TableRow>
        {firstInRow ? (<TableCell sx={{verticalAlign: "top"}} rowSpan={numberOfRows}>{myDateFormat(new Date(absence.date_time))}</TableCell>) : null}
        {userSpecified ? null : (<TableCell><b><AbsenceAuthor userId={absence.user_id}/></b></TableCell>)}
        <TableCell>{absenceTypes[absence.type]}</TableCell>
        <TableCell>{formatFromTo(absence.from_time, absence.to_time)}</TableCell>
    </TableRow>
    )
}