import React from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { formatFromTo, isAbsenceEditable } from '../../helpers/helpers.js'

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
import { useDeleteAbsenceMutation, useGetAbsenceTypesQuery } from '../api/absenceSlice'
import { toast } from 'react-toastify'
import { AbsenceAuthor } from './AbsenceAuthor'

export const AbsenceDetailDialog = ({open, absence, onClose, openEdit}) => {
    const user = useSelector(selectLoggedUser)
    
    const [openConfirm, setOpenConfirm] = React.useState(false)
    const [deleteAbsence, {}] = useDeleteAbsenceMutation()

    const {data: absenceTypes={}} = useGetAbsenceTypesQuery()

    async function submitDelete(){
        try{
            await deleteAbsence(absence.id).unwrap()
            toast("Neprítomnosť odstránená", {type:"success", autoClose: 1000})
        }    
        catch(err){
            toast("Neprítomnosť sa nepodarilo odstrániť", {type: "error"})
        }
    }

    if(!open){
        return null
    }
    const toConfirm = ["ABSENCE_WORKFROMHOME", "ABSENCE_TRAVEL"].includes(absence.key)
    const confirmed = absence.confirmation ? "potvrdené" : "nepotvrdené"
    return (
        <>
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
        >
            <DialogTitle style={{marginRight: "2em"}}>
                {absence ? "Neprítomnosť " + format(new Date(absence.date_time), "dd.MM.yy") : ""}
            </DialogTitle>
            <IconButton
                onClick={onClose}
                sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                <Close />
            </IconButton>
            <DialogContent>
                <p><AbsenceAuthor userId={absence.user_id} fullName={true}/></p>
                <p>Nepritomnosť v čase: {formatFromTo(absence?.from_time, absence?.to_time)}</p>
                <p>{ absenceTypes[absence?.type].value } {toConfirm ? "("+ confirmed +")" : ""}</p>
                <p>Popis: {absence?.description}</p>
                { isAbsenceEditable(absence, user) ?
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
                        onClick={() => openEdit(absence)}
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
            noAction={() => {
                setOpenConfirm(false)
            }}
            yesAction={() => {
                submitDelete()
                setOpenConfirm(false)
                onClose()
            }}
        />
        
        </>
    )
}