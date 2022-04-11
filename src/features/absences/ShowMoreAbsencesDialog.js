import React from 'react'
import {
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent
} from '@mui/material'

import { Close } from '@mui/icons-material'
import { format, parseISO } from 'date-fns'
import { AbsenceBox } from './CalendarDisplay'

export const ShowMoreAbsencesDialog = ({absences, open, onClose, onDetail}) => {
    if(!absences){
        return null
    }
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
        >
            <DialogTitle style={{marginRight: "2em"}}>
                Neprítomnosti {format(parseISO(absences[0].date_time), "dd.MM.yyyy")}
            </DialogTitle>
            <IconButton
                onClick={onClose}
                sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                <Close />
            </IconButton>
            <DialogContent>
                {absences.map(ab => (
                    <AbsenceBox 
                        absence={ab}
                        funOnClick={() => onDetail(ab)}
                        style={{margin: "2em 0"}}
                    />
                ))}            
            </DialogContent>
        </Dialog>
    )
}