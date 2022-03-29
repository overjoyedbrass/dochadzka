import React from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { formatFromTo } from '../../helpers/helpers.js'

import {
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    Button
} from '@mui/material'

import {  ConfirmDialog } from '../../components/ConfirmDialog'

import { Close } from '@mui/icons-material'
import { selectLoggedUser } from '../auth/authSlice'


export const AbsenceDetailDialog = ({open, absence, onClose, openEdit}) => {
    const loggedUser = useSelector(selectLoggedUser)
    
    const [openConfirm, setOpenConfirm] = React.useState(false)

    if(!open){
        return null
    }
    return (
        <>
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                {absence ? "Neprítomnosť: " + format(new Date(absence.date_time), "dd.MM.yy") : ""}
            </DialogTitle>
            <IconButton
                onClick={onClose}
                sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                <Close />
            </IconButton>
            <DialogContent>
                <p>Nepritomnosť v čase: {formatFromTo(absence?.from_time, absence?.to_time)}</p>
                <p>Typ neprítomnosti: {absence?.type}</p>
                <p>Popis: {absence?.description}</p>
                { absence?.user_id === loggedUser?.id ?
                <div
                    style={{display:"flex", width:"100%", justifyContent: "space-between"}}
                >
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setOpenConfirm(true)}
                    >
                        Odstrániť
                    </Button>

                    <Button
                        onClick={openEdit}
                        variant='contained'
                    >
                        Upraviť
                    </Button>
                </div>
                 : null
                }
            </DialogContent>
        </Dialog>
        <ConfirmDialog
            open={openConfirm}
            question="Chcete skutočne odstrániť neprítomnosť?"
            noText="Zrušiť"
            yesText="Odstrániť"
            noAction={() => setOpenConfirm(false)}
            yesAction={() => {
                console.log("nepritomnost ODSTRANENA")
                setOpenConfirm(false)
                onClose()
            }}
        />
        </>
    )
}