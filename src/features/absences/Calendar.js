import { useSelector } from 'react-redux'
import React, { useState } from 'react'
import { 
    Button, IconButton,
    TableBody, TableCell, TableContainer, Table, TableRow, Paper,
    Dialog, DialogContent, DialogTitle,
} from '@mui/material'
import { Close, AddCircle } from '@mui/icons-material'

import { sub, add, startOfMonth, format} from 'date-fns'
import { sk } from 'date-fns/locale'
import { displaySelectedMonth, disableSelection } from '../../helpers/helpers'
import { selectCurrentUser } from '../users/userSlice.js'
import { useGetAbsencesQuery } from '../api/apiSlice'
import { Spinner } from '../../components/Spinner.js'
import { CalendarCell } from './CalendarCell'

import { AbsenceFormular } from './AbsenceFormular.js'
import { AbsenceEditFormular } from './AbsenceEditFormular.js'
import { mainTheme, guiColors } from '../../helpers/themes.js'
import Draggable from 'react-draggable'

const week = {
    pondelok: 0,
    utorok: 1,
    streda: 2,
    štvrtok: 3,
    piatok: 4,
    sobota: 5,
    nedeľa: 6
}

var mouseDownCount = 0;
document.body.onmousedown = function() { 
    mouseDownCount = 1;
}
document.body.onmouseup = function() {
    mouseDownCount = 0;
}

Date.prototype.sameMonth = function (other) {
    return this.getYear() === other.getYear() && this.getMonth() === other.getMonth()
}
Date.prototype.sameDay = function(other){
    return this.getYear() === other.getYear() && this.getMonth() === other.getMonth() && this.getDate() === other.getDate()
}

export const CalendarWithPicker = () => {
    const [viewDate, setViewDate] = useState(new Date())
    const subMonth = () => {
        setViewDate(sub(viewDate, {months: 1}))
    }
    const addMonth = () => {
        setViewDate(add(viewDate, {months: 1}))
    }

    return (
        <div className="calendar">
            <Button variant="outlined" onClick={() => setViewDate(new Date())}>Dnes</Button>
            <Button onClick={subMonth}>{"<"}</Button>
            <Button onClick={addMonth}>{">"}</Button>
            <b>{displaySelectedMonth(viewDate)}</b>
            <AbsencesToCalendar viewDate={viewDate}/>
        </div>
    )
}

const AbsencesToCalendar = ({viewDate}) => {
    const userId = useSelector(selectCurrentUser)
    const{
        data: absences=[],
        isLoading,
        isSuccess,
        isError,
        error,
        isFetching
    } = useGetAbsencesQuery({year: viewDate.getFullYear(), month: viewDate.getMonth(), userid: userId})

    const groupedAbsences = {}
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
            content = (<Calendar viewDate={viewDate} absences={groupedAbsences}/>)
        }
    } else if(isError){
        console.log('Chyba', error)
        content = <div> Chyba: {error.status}</div>
    }
    return content
}



const Calendar = ({viewDate, absences}) => {
    const [open, setOpen] = useState(false)
    const [dates, setPickedDates] = useState([])
    const [editDialog, setEditDialog] = useState({isOpen: false, ab: null})

    var [adding, setIsAdding] = useState(true)
    var [hovering, setHovering] = useState(false)
    function addRemoveDay(clickedDate, reset=false){
        if(adding){
            if(reset || !dates.some(d => d.sameDay(clickedDate))){
                const copy = reset ? [] : dates.slice()
                copy.push(clickedDate)
                copy.sort((d1, d2) => d1 - d2)
                setPickedDates(copy)
            }
        }
        else{
            const copy = dates.filter(dd => !dd.sameDay(clickedDate))
            setPickedDates(copy)
        }
    }

    const mouseDown = (event, clickedDay) => {
        disableSelection()
        setHovering(true)

        let reset = true
        const clickedDate = new Date(viewDate)
        clickedDate.setDate(clickedDay)

        if(event.ctrlKey){
            reset = false
            adding = !dates.some(d => d.sameDay(clickedDate)) ? true : false
        }
        else{
            adding = true
        }
        setIsAdding(adding)
        addRemoveDay(clickedDate, reset)
    }

    const mouseUp = (event) => {
        setHovering(false)
        setIsAdding(true)
    
    }

    const doubleClick = () => {
        setOpen(true)
    }

    const handleHover = (event, hoveredDay) => {
        if(event.shiftKey) return
        if(mouseDownCount === 0) hovering = false
        if(!hovering) return
        const hoveredDate = new Date(viewDate)
        hoveredDate.setDate(hoveredDay)
        addRemoveDay(hoveredDate)
    }

    const closeDialog = (submitted) => {
        setOpen(false)
        setHovering(false)
        if(submitted){
            setPickedDates([])
        }
    }

    const openEditDialog = (ab) => {
        setEditDialog({isOpen: true, ab: ab})
    }

    const dnes = new Date()
    let rows = []
    //hlavičky stlpcov
    for (const [key, value] of Object.entries(week)) {
        rows.push((<TableCell key={value} sx={{borderBottom:"0.01em solid", userSelect: "none", borderColor: guiColors.border}}>{key}</TableCell>))
    }
    rows = [(<TableRow key={0}>{rows}</TableRow>)]
    
    //riadok tabuľky
    let row = []    
    //cyklovany deň, od 1. v mesiaci po posledny
    var cycledDate = startOfMonth(viewDate)
    //kľuč do slovnika tyzdnov, ziskame tym odskok, piatok = odskok 4 bunky
    const cycledDateDayKey = format(cycledDate, "eeee", {locale: sk})
    const skok = week[cycledDateDayKey]
    //prazdne bunky pred prvym dňom
    for(let i = 1; i <= skok; i++){
        row.push((<TableCell key={i%7}/>))
    }

    //všetky zvyšné bunky
    while(cycledDate.getMonth() === viewDate.getMonth()){
        let i = cycledDate.getDate()
        row.push((
        <TableCell 
            onMouseDown={(event) => mouseDown(event, i)}
            onMouseUp={(event) => mouseUp(event)}

            onMouseEnter={(event) => handleHover(event, i)}
            onDoubleClick={() => doubleClick(i)} 
            key={(i+skok)%7}

            sx={{border: "1px solid", 
                borderColor: guiColors.border,
                backgroundColor: dates.some(d => d.sameDay(cycledDate)) ? guiColors.picked :
                [6, 0].includes((i+skok)%7) ? guiColors.weekend : guiColors.primary
            }}
        >
            <CalendarCell isToday={dnes.getDate() === i && dnes.sameMonth(viewDate)} day={i} absences={absences[i]} fun={openEditDialog}/>
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
        <> 
        <TableContainer component={Paper}
        onMouseUp={() => setHovering(false)} sx={{dragable:"false"}}
        >
            <Table aria-label="calendar" sx={{tableLayout:"fixed"}}>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </TableContainer>

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
        {open ? null : (
            <div style={{position: "fixed", bottom: "3em", right: "3em"}}>
                <IconButton onClick={() => setOpen(true) }><AddCircle  sx={{ fontSize: 60}} style={{ color: mainTheme.palette.primary.main}}/></IconButton>
            </div>
        )}
        <Dialog
            open={editDialog.isOpen}
            onClose={() => setEditDialog({isOpen:false, ab:null})}
        >
            <DialogTitle>{editDialog.ab ? "Neprítomnosť: " + format(new Date(editDialog.ab.date_time), "dd.MM.yy") : ""}</DialogTitle>
            <DialogContent>
                <AbsenceEditFormular ab={editDialog.ab}/>
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