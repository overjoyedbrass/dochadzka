import React from 'react'
import {
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    FormControlLabel,
    Checkbox,
    TextField,
    ButtonGroup,
    Button,
    Select,
    MenuItem,

} from '@mui/material'
import { Close } from '@mui/icons-material'
import { appTheme } from '../../helpers/themes.js'
import { format, parseISO } from 'date-fns'
import { absenceTypes, isFullDay as isAbsenceFullDay } from '../../helpers/helpers.js'
import { useUpdateAbsenceMutation } from '../api/apiSlice'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/Spinner'

export const AbsenceEditDialog =  ({open, onClose, absence}) => {
    const [isFullDay, setFullDay] = React.useState(isAbsenceFullDay(absence.from_time, absence.to_time))
    const [fromTime, setFromTime] = React.useState(absence.from_time)
    const [toTime, setToTime] = React.useState(absence.to_time)

    const [publicValue, setPublic] = React.useState(absence?.public)
    const [type, setType] = React.useState(absence.type)
    const [description, setDescription] = React.useState(absence.description)
    const [ updateAbsence, { isLoading }] = useUpdateAbsenceMutation()


    const popisText = type !== "Dovolenka" ? "Dôvod neprítomnosti" : "Miesto pobytu na dovolenke"
    async function submit(e){
        e.preventDefault()
        const patch = {
            id: absence.id,
            from_time: isFullDay ? "08:00" : fromTime,
            to_time: isFullDay ? "16:00" : toTime,
            public: publicValue,
            type: type,
            description: description
        }
        try{
            const date = parseISO(absence.date_time)
            await updateAbsence({
                id: absence.id, 
                year: date.getFullYear(), 
                month: date.getMonth(),
                ...patch
            }).unwrap()
            toast("Neprítomnosť úspešne upravená", {type: "success"})
        }
        catch(err){
            toast("Úprava neprítomnosti sa nepodarila", {type: "error"})
        }
    }
    if(!open){
        return null
    }
    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                Editácia neprítomnosti {format(parseISO(absence.date_time), "dd.MM.yyyy")}
            </DialogTitle>
            <IconButton
                onClick={onClose}
                sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                <Close />
            </IconButton>
            <DialogContent>
                <form onSubmit={submit}>
                Neprítomnosť v čase: <br/>
                <FormControlLabel control={<Checkbox checked={isFullDay} onChange={(event) => setFullDay(event.target.checked)}/>} label="Celý deň" />
                {isFullDay ? null : 
                    (<>
                    <br/>
                    <FormControlLabel sx={{marginLeft: 0}} control={ 
                        <TextField onChange={(event) => setFromTime(event.target.value)} size="small" id="fromTime" type="time" defaultValue={fromTime} inputProps={{step: 300}}/>} labelPlacement="start" label="Od:   "
                    />
                    <label style={{paddingLeft: "1em"}} htmlFor="toTime">Do: </label>
                    <TextField onChange={(event) => setToTime(event.target.value)} id="toTime" type="time" size="small" defaultValue={toTime} inputProps={{step: 300}}/>
                    </>)}<br/>
                

                Zverejniť: <br />
                <ButtonGroup style={{marginTop: "0.5em", marginBottom: "1em"}}>
                    {["Nezverejniť", "Kolegom", "Všetkým"].map((o, i) => (
                        <Button style={{textTransform: "none"}} variant={publicValue === i ? "contained" : "outlined"} key={i} onClick={()=> setPublic(i)}>{o}</Button>
                    ))}
                </ButtonGroup><br />

                <label htmlFor="typNeprit">Druh neprítomnosti: </label>
                <Select id="typNeprit" value={type} size="small" onChange={event => setType(event.target.value)}>
                    {absenceTypes.map((d, i) => <MenuItem key={i} value={i}>{d}</MenuItem>)}
                </Select><br/><br/>
                <label htmlFor="popis">{popisText}: </label>
                <TextField id="popis" onChange={event => setDescription(event.target.value)} multiline sx={{width: "90%"}} helperText="Nepovinné" value={description} /><br/><br/>
                
                {isLoading ? <Spinner /> : <>
                <Button variant="outlined" onClick={() => onClose()}>Zrušiť</Button>
                <Button sx={{float:"right"}} style={{fill: appTheme.palette.primary.main}} variant="contained" type="submit">Potvrdiť zmeny</Button></>}
                </form>
            </DialogContent>

        </Dialog>
    )
}