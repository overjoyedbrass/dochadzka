import React, { useState } from 'react'
import { 
    IconButton,
    Button,
    ButtonGroup
} from '@mui/material'

import { useGetAbsencesQuery, useGetHolidaysQuery } from '../api/apiSlice'
import { Spinner } from '../../components/Spinner.js'


import { AbsenceDisplayer } from './AbsenceDisplayer'

import { DateController } from '../../components/DateController'

import './Calendar.css'
import { useSelector } from 'react-redux'
import { selectLoggedUser } from '../auth/authSlice' 
import { UserSelect } from '../users/UserSelect'
import { parseISO } from 'date-fns' 

import { 
    CalendarToday as CalendarIcon,
    ViewList as ListIcon
} from '@mui/icons-material';

export const AbsenceController = () => {
    const loggedUser = useSelector(selectLoggedUser)
    const [selectedUser, setSelectedUser] = useState(loggedUser?.id)
    const [viewDate, setViewDate] = useState(new Date())
    const [calendarDisplay, showCalendarDisplay] = useState(true)

    return (
    <>
        <div className="controllerBar">
            <div className="wrapper">
                <DateController 
                    viewDate={viewDate} 
                    onChange={(date) => setViewDate(date)} 
                />
            </div>

            <div className="wrapper">
                {loggedUser && selectedUser !== loggedUser.id ? 
                    <span>
                    <Button 
                        variant="outlined"
                        onClick={() => setSelectedUser(loggedUser.id)}
                        sx={{
                            marginRight: "0.2em",
                            height: "100%"
                        }}
                    >
                        Zobraziť Vaše
                </Button></span> : null}
                <UserSelect 
                    onChange={setSelectedUser} 
                    selected={selectedUser}
                    onlyActive={true}
                />
                <span style={{marginLeft: "2em", display: "flex", alignItems: "center"}}>Zobrazenie: </span>
                <ButtonGroup>
                    <IconButton onClick={() => showCalendarDisplay(true)}>
                        <CalendarIcon 
                            color={ calendarDisplay ? "primary" : ""}
                        />
                    </IconButton>
                    <IconButton onClick={() => showCalendarDisplay(false)}>
                        <ListIcon
                            color={ calendarDisplay ? "" : "primary"}
                        />
                    </IconButton>
                </ButtonGroup>
            </div>
        </div>
        <AbsenceMiddleware 
            viewDate={viewDate} 
            userId={selectedUser ?? ""}
            calendarDisplay={calendarDisplay}
        />
    </>
    )

}


// spojka medzi vyberaním dátumu a zobrazovaním
// na tomto mieste sa načítavaju data
const AbsenceMiddleware = ({viewDate, userId, calendarDisplay}) => {
    const{
        data: absences=[],
        isLoading,
        isSuccess,
        isError,
        error,
        isFetching
    } = useGetAbsencesQuery({year: viewDate.getFullYear(), month: viewDate.getMonth() + 1, userid: userId})

    const {
        data: holidays=[],
    } = useGetHolidaysQuery(viewDate.getFullYear())

    const groupedAbsences = []
    for(let i = 1; i <= 31; i++){
        groupedAbsences[i] = []
    }
    holidays.forEach(h => {
        var [date_time, description] = [h.date_time, h.description]
        date_time = parseISO(date_time)
        if(date_time.getMonth() === viewDate.getMonth()){
            groupedAbsences[date_time.getDate()].push({date_time, description, isHoliday: true}) 
        }
    })

    absences.forEach(absence => {
        const datum = new Date(absence.date_time);
        groupedAbsences[datum.getDate()].push(absence);
    });

    let content = (<b>Loading. . .</b>)
    if(isLoading){
        content = <Spinner text="Loading..."/>
    } else if (isSuccess){
        if(isFetching){
            content = <Spinner text="Loading..."/>
        }
        else{
            content = (
                <AbsenceDisplayer viewDate={viewDate} calendarDisplay={calendarDisplay} absences={groupedAbsences}/>
            )
        }
    } else if(isError){
        console.log('Chyba', error)
        content = <div> Chyba: {error.status}</div>
    }
    return content
}
