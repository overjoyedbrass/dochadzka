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
import { mainTheme } from '../../helpers/themes.js'
import { format, parseISO } from 'date-fns'
import { absenceTypes, isFullDay as isAbsenceFullDay } from '../../helpers/helpers.js'

export const AbsenceEditDialog =  ({open, onClose, absence}) => {
    const [isFullDay, setFullDay] = React.useState(isAbsenceFullDay(absence.from_time, absence.to_time))
    const [fromTime, setFromTime] = React.useState(absence.from_time)
    const [toTime, setToTime] = React.useState(absence.to_time)

    const [publicValue, setPublic] = React.useState(absence?.public)
    const [type, setType] = React.useState(absence.type)
    const [description, setDescription] = React.useState(absence.description)

    // rtk query PATCH request hook


    const popisText = type !== "Dovolenka" ? "Dôvod neprítomnosti" : "Miesto pobytu na dovolenke"
    function submit(){
        onClose()
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
                <>

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
                <TextField id="popis" onChange={event => setDescription(event.target.value)}multiline sx={{width: "90%"}} helperText="Nepovinné">{description}</TextField><br/><br/>

                <Button variant="outlined" onClick={() => onClose()}>Zrušiť</Button>
                <Button sx={{float:"right"}} style={{fill: mainTheme.palette.primary.main}} variant="contained" onClick={() => submit()}>Potvrdiť zmeny</Button>
                </>
            </DialogContent>

        </Dialog>
    )
}