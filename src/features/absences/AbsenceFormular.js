import React from 'react'
import { IconButton, Button, ButtonGroup, TextField, Select, MenuItem, FormControl, FormControlLabel, Checkbox } from "@mui/material"
import { DeleteForever, Add } from '@mui/icons-material'
import { useSelector } from 'react-redux'

import { format, parseISO, add } from 'date-fns'
import { mainTheme } from  "../../helpers/themes.js"

import { absenceTypes, datesAreSame } from '../../helpers/helpers.js'
import { useInsertAbsencesMutation } from '../api/apiSlice.js'
import { selectLoggedUser } from '../auth/authSlice'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/Spinner'

export const AbsenceFormular = ({onClose, dates, setPickedDates}) => {
    const [isFullDay, setFullDay] = React.useState(true)

    const [fromTime, setFromTime] = React.useState("08:00")
    const [toTime, setToTime] = React.useState("16:00")

    const [publicValue, setPublic] = React.useState(0)
    const [type, setType] = React.useState(1)
    const [description, setDescription] = React.useState("")

    const [ addAbsences, { isAddingAbsence }] = useInsertAbsencesMutation()

    const user = useSelector(selectLoggedUser)

    function updateDates(index, newDate){
        if(newDate === null){
            dates.splice(index, 1)
        }
        else{
            if(!dates.some(d => datesAreSame(d, newDate))){
                dates[index] = newDate
            }
            else {
                toast(`${format(newDate, "dd. MM. yyyy")} Je už vybratý.`, {type: "warning"})
            }
        }
        setPickedDates(dates)
    }
    function addDate(){
        const newDate = add(dates.at(-1), {days: 1})
        dates.push(newDate)
        setPickedDates(dates)
    }

    async function submit(){
        const absences = []
        dates.forEach(d => {
            absences.push({
                user_id: user.id,
                date_time: format(d, "yyyy-MM-dd"),
                from_time: isFullDay ? "08:00" : fromTime,
                to_time: isFullDay ? "16:00" : toTime,
                description: description,
                type: type,
                public: publicValue,
                confirmation: 1
            })
        })

        try {
            await addAbsences(absences).unwrap()
            toast("Pridanie neprítomností úspešne", { type: "success"})
            onClose(true)
        }
        catch(err){
            toast("Pridanie neprítomnosti sa nepodarilo.", { type: "error"})
        }
    }
    const popisText = type !== 1 ? "Dôvod neprítomnosti" : "Miesto pobytu na dovolenke"
    const labelForDni = dates.length <= 1 ? "Deň neprítomnosti: " : `Dni neprítomnosti (${dates.length})`
    
    
    return (
        <div>
            <div style={{maxHeight: "200px", overflow: "auto"}}>
                <label htmlFor="date">{labelForDni}</label>
                <IconButton style={{color: mainTheme.palette.primary.main}} onClick={() => addDate()}>
                    <Add />
                </IconButton>
            {dates.map((date, index) => 
                (<div key={index}>
                <br/>
                <TextField style={{marginBottom:"0.5em"}} id="date" type="date" size="small" onChange={(event) => updateDates(index, parseISO(event.target.value))} value={format(date, "yyyy-MM-dd")} />
                {dates.length > 1 ? (<IconButton onClick={() => updateDates(index, null)}><DeleteForever /></IconButton>) : null}
                </div>)
            )}
            </div><br/>

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
                {absenceTypes.slice(1).map((d, i) => <MenuItem key={i} value={i+1}>{d}</MenuItem>)}
            </Select><br/><br/>
            <label htmlFor="popis">{popisText}: </label>
            <TextField id="popis" onChange={event => setDescription(event.target.value)} multiline sx={{width: "90%"}} helperText="Nepovinné">{description}</TextField><br/><br/>
            {isAddingAbsence ? <Spinner /> : <>
            <Button variant="outlined" onClick={() => onClose()}>Zrušiť</Button>
            <Button color="success" sx={{float:"right"}} variant="contained" onClick={() => submit()}>Pridať</Button></>}
        </div>
    )
}