import React from 'react'
import { useSelector } from 'react-redux'
import { selectLoggedBoolean, selectLoggedUser, selectUserPerms } from '../auth/authSlice'
import { AbsenceFormular } from './AbsenceFormular'
import { AbsenceDetailDialog } from './AbsenceDetailDialog'
import { appTheme } from '../../helpers/themes'
import Draggable from 'react-draggable'
import { CalendarDisplay } from './CalendarDisplay'
import { AbsencesList } from './AbsencesList'
import { AbsenceEditDialog } from './AbsenceEditDialog'
import { ShowMoreAbsencesDialog } from './ShowMoreAbsencesDialog'
import { toast } from 'react-toastify'
import { 
    IconButton,
    Paper,
    Dialog, DialogContent, DialogTitle,
} from '@mui/material'
import { Close, AddCircle } from '@mui/icons-material'

import { datesAreSame, disableSelection } from '../../helpers/helpers'


var mouseDownCount = 0;
document.body.onmousedown = function() { 
    mouseDownCount = 1;
}
document.body.onmouseup = function() {
    mouseDownCount = 0;
}

export const AbsenceDisplayer = ({viewDate, absences, calendarDisplay}) => {
    const [open, setOpen] = React.useState(false)
    const [dates, setPickedDates] = React.useState([])

    //dialogues
    const [absenceDetail, setAbsenceDetail] = React.useState(null)
    const [displayMore, setDisplayMore] = React.useState(null)
    const [absenceEdit, setAbsenceEdit] = React.useState(null)

    //control fucntionality
    const [adding, setIsAdding] = React.useState(true)
    const [hovering, setHovering] = React.useState(false)

    const perms = useSelector(selectUserPerms)
    const isLogged = useSelector(selectLoggedBoolean)

    function addRemoveDay(clickedDate, add_day, reset=false){
        if(clickedDate < new Date() && !perms.includes("bypass_time")){
            toast("Nemôžete zadávať do minulosti", {type: "warning", toastId: 50})
            return
        }

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
    function closeDialog (clearDates) {
        setOpen(false)
        setHovering(false)
        if(clearDates){
            setPickedDates([])
        }
    }

    function mouseDown (event, clickedDay) {
        if(!isLogged) return;
        if(event.currentTarget !== event.target ) return;
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
        if(!isLogged) return;
        if(event.currentTarget !== event.target ) return;
        setHovering(false)
        setIsAdding(true)
    }
    
    function doubleClick(event){
        if(!isLogged) return;
        if(event.currentTarget !== event.target ) return;
        setOpen(true)
    }

    function handleHover(event, hoveredDay) {
        if(!isLogged) return;
        if(event.shiftKey) return
        if(mouseDownCount === 0) setHovering(false)
        if(!hovering) return
        const hoveredDate = new Date(viewDate)
        hoveredDate.setDate(hoveredDay)
        addRemoveDay(hoveredDate, adding)
    }

    return (
        <>
        { calendarDisplay ? 
            <CalendarDisplay 
                viewDate={viewDate}
                controlFunctions={{
                    mup: mouseUp,
                    mdown: mouseDown,
                    hover: handleHover,
                    dc: doubleClick,
                    setHovering: setHovering,
                    detail: (ab) => setAbsenceDetail(ab),
                    showMore: (day) => setDisplayMore(day)
                }}
                absences={absences}
                selectedDates={dates}
            /> :
            <AbsencesList 
                absences={absences} 
                viewDate={viewDate}
                showDetail={(ab) => setAbsenceDetail(ab)}
                openEdit={(absence) => setAbsenceEdit(absence)}
            />
        }
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
        {!open && isLogged ? (
            <div style={{position: "fixed", bottom: "3em", right: "3em"}}>
                <IconButton onClick={() => setOpen(true) }><AddCircle  sx={{ fontSize: 60}} style={{ color: appTheme.palette.primary.main}}/></IconButton>
            </div>) : null
        }

        <AbsenceDetailDialog 
            onClose={() => setAbsenceDetail(null)}
            open={absenceDetail ? true : false}
            absence={absenceDetail}
            openEdit={(absence) => setAbsenceEdit(absence)}
        />

        <ShowMoreAbsencesDialog 
            onClose={() => setDisplayMore(null)}
            absences={absences[displayMore]}
            open={displayMore ? true : false}
            onDetail={setAbsenceDetail}
        />
        
        {!absenceEdit ? null : 
        <AbsenceEditDialog 
            open={absenceEdit ? true : false}
            onClose={() => {
                setAbsenceEdit(null)
                setAbsenceDetail(null)
            }}
            absence={absenceEdit}
        />}
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