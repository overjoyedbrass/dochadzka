import React, { useState } from 'react'
import { 
    IconButton,
    Button,
    Paper,
    Dialog, DialogContent, DialogTitle,
} from '@mui/material'
import { Close, AddCircle } from '@mui/icons-material'

import { format } from 'date-fns'
import { datesAreSame, disableSelection } from '../../helpers/helpers'
import { useGetAbsencesQuery } from '../api/apiSlice'
import { Spinner } from '../../components/Spinner.js'

import { AbsenceFormular } from './AbsenceFormular.js'
import { AbsenceEditFormular } from './AbsenceEditFormular.js'
import { mainTheme } from '../../helpers/themes.js'
import Draggable from 'react-draggable'
import { CalendarDisplay } from './CalendarDisplay'
import { DateController } from '../../components/DateController'

import './Calendar.css'
import { useSelector } from 'react-redux'
import { selectLoggedUser, selectLoggedBoolean } from '../auth/authSlice'
import { UserSelect } from '../users/UserSelect'

var mouseDownCount = 0;
document.body.onmousedown = function() { 
    mouseDownCount = 1;
}
document.body.onmouseup = function() {
    mouseDownCount = 0;
}

export const CalendarController = () => {
    const loggedUser = useSelector(selectLoggedUser)
    const [userId, setUserId] = useState(loggedUser?.id)
    const [viewDate, setViewDate] = useState(new Date())

    return (
        <div className="calendar-controller">
            <div className="wrapper">
                {loggedUser && userId !== loggedUser.id ? 
                <Button 
                    variant="outlined"
                    onClick={() => setUserId(loggedUser.id)}
                    sx={{marginRight: "0.2em"}}
                >
                    Zobraziť moje
                </Button> : null}

                <DateController 
                    viewDate={viewDate} 
                    onChange={(date) => setViewDate(date)} 
                />
                <UserSelect 
                    onChange={setUserId} 
                    selected={userId}
                />
            </div>
            <CalendarMiddleware 
                viewDate={viewDate} 
                userId={userId ?? ""}
            />
        </div>
    )

}

const CalendarMiddleware = ({viewDate, userId}) => {
    const{
        data: absences=[],
        isLoading,
        isSuccess,
        isError,
        error,
        isFetching
    } = useGetAbsencesQuery({year: viewDate.getFullYear(), month: viewDate.getMonth(), userid: userId})

    const groupedAbsences = []
    for(let i = 1; i <= 31; i++){
        groupedAbsences[i] = []
    }
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
                <CalendarAndDialog viewDate={viewDate} absences={groupedAbsences}/>
            )
        }
    } else if(isError){
        console.log('Chyba', error)
        content = <div> Chyba: {error.status}</div>
    }
    return content
}


const CalendarAndDialog = ({viewDate, absences}) => {
    const [open, setOpen] = useState(false)
    const [dates, setPickedDates] = useState([])
    const [editDialog, setEditDialog] = useState({isOpen: false, absence: null})

    const [adding, setIsAdding] = useState(true)
    const [hovering, setHovering] = useState(false)

    const logged = useSelector(selectLoggedBoolean)

    function addRemoveDay(clickedDate, add_day, reset=false){
        if(add_day){
            if(reset || !dates.some(d => datesAreSame(d, clickedDate))){
                const copy = reset ? [] : dates.slice()
                copy.push(clickedDate)
                copy.sort((d1, d2) => d1 - d2)
                setPickedDates(copy)
            }
        }
        else{
            const copy = dates.filter(dd => !datesAreSame(dd, clickedDate))
            setPickedDates(copy)
        }
    }
    function closeDialog (submitted) {
        setOpen(false)
        setHovering(false)
        if(submitted){
            setPickedDates([])
        }
    }

    function openEditDialog (ab) {
        setEditDialog({isOpen: true, absence: ab})
    }

    function mouseDown (event, clickedDay) {
        if(!logged) return;
        if(event.currentTarget != event.target ) return;
        disableSelection()
        setHovering(true)

        let reset = true
        const clickedDate = new Date(viewDate)
        clickedDate.setDate(clickedDay)

        let adding_bool = false;
        if(event.ctrlKey){
            reset = false
            adding_bool = !dates.some(d => datesAreSame(d, clickedDate))
        }
        else{
            adding_bool = true
        }
        setIsAdding(adding_bool)
        addRemoveDay(clickedDate, adding_bool, reset)
    }

    function mouseUp(event){
        if(!logged) return;
        if(event.currentTarget != event.target ) return;
        setHovering(false)
        setIsAdding(true)
    }
    
    function doubleClick(event){
        if(!logged) return;
        if(event.currentTarget != event.target ) return;
        setOpen(true)
    }

    function handleHover(event, hoveredDay) {
        if(!logged) return;
        if(event.shiftKey) return
        if(mouseDownCount === 0) setHovering(false)
        if(!hovering) return
        const hoveredDate = new Date(viewDate)
        hoveredDate.setDate(hoveredDay)
        addRemoveDay(hoveredDate, adding)
    }

    return (
        <>
        <CalendarDisplay 
            viewDate={viewDate}
            controlFunctions={{
                mup: mouseUp,
                mdown: mouseDown,
                hover: handleHover,
                dc: doubleClick,
                edit: openEditDialog,
                setHovering: setHovering
            }}
            absences={absences}
            selectedDates={dates}
        />
        <Dialog 
            hideBackdrop={true}
            open={open} 
            maxWidth="sm"
            aria-labelledby="draggable-dialog-title"
            PaperComponent={PaperComponent}
            position={{x: 0, y: 0}}
        >
            <DialogTitle 
                onClose={() => closeDialog(false)}
                style={{ cursor: 'move' }}
                >
                Zadávanie neprítomnosti
            </DialogTitle>
            <IconButton
                onClick={() => closeDialog(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                <Close />
            </IconButton>
            <DialogContent>
                {open ? (<AbsenceFormular onClose={closeDialog} dates={dates.length > 0 ? dates.slice() : [new Date()]} setPickedDates={(dates) => setPickedDates(dates)}/>) : null }
            </DialogContent>
        </Dialog>
        {!open && logged ? (
            <div style={{position: "fixed", bottom: "3em", right: "3em"}}>
                <IconButton onClick={() => setOpen(true) }><AddCircle  sx={{ fontSize: 60}} style={{ color: mainTheme.palette.primary.main}}/></IconButton>
            </div>) : null
        }

        <Dialog
            open={editDialog.isOpen}
            onClose={() => setEditDialog({isOpen:false, absence:null})}
        >
            <DialogTitle>{editDialog.absence ? "Neprítomnosť: " + format(new Date(editDialog.absence.date_time), "dd.MM.yy") : ""}</DialogTitle>
            <IconButton
                onClick={() => setEditDialog({isOpen:false, absence: null})}
                sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                <Close />
            </IconButton>
            <DialogContent>
                <AbsenceEditFormular ab={editDialog.absence}/>
            </DialogContent>
        </Dialog>
        </>
    )
}

function PaperComponent(props) {
    const nodeRef = React.useRef(null)
    return (
      <Draggable
        nodeRef={nodeRef}
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} ref={nodeRef}/>
      </Draggable>
    );
  }