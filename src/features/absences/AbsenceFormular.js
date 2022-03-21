import React from 'react'
import { IconButton, Button, ButtonGroup, TextField, Select, MenuItem, FormControl, FormControlLabel, Checkbox } from "@mui/material"
import { DeleteForever, Add } from '@mui/icons-material'

import { format, parseISO, add } from 'date-fns'
import { mainTheme } from  "../../helpers/themes.js"

import { absenceTypes, datesAreSame } from '../../helpers/helpers.js'
import { useUpdateAbsencesMutation } from '../api/apiSlice.js'
import { toast } from 'react-toastify'

export const AbsenceFormular = ({onClose, dates, setPickedDates}) => {
    const [isFullDay, setFullDay] = React.useState(true)

    const [fromTime, setFromTime] = React.useState("08:00")
    const [toTime, setToTime] = React.useState("16:00")

    const [publicValue, setPublic] = React.useState(0)
    const [type, setType] = React.useState(absenceTypes[0])
    const [description, setDescription] = React.useState("")

    const [addAbsences, { loading }] = useUpdateAbsencesMutation()

    function updateDates(index, newDate){
        if(newDate === null){
            dates.splice(index, 1)
        }
        else{
            if(!dates.some(d => datesAreSame(d, newDate))){
                dates[index] = newDate
            }
            else {
                toast(`${format(newDate, "dd-MM-yyyy")} Je už vybratý.`, {toastId: 1, type: "warning"})
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
        try {
            const response = await addAbsences().unwrap()
            const data = JSON.stringify(response)
            toast("Pridanie neprítomností úspešne", { type: "success"})
            //invalidate tags in RTK Query
            onClose(true)
        }
        catch(err){
            toast("Pridanie neprítomnosti sa nepodarilo, skúste znovu", { type: "error"})
        }
    }
    const popisText = type !== "Dovolenka" ? "Dôvod neprítomnosti" : "Miesto pobytu na dovolenke"
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
                {absenceTypes.map((d, i) => <MenuItem key={i} value={d}>{d}</MenuItem>)}
            </Select><br/><br/>
            <label htmlFor="popis">{popisText}: </label>
            <TextField id="popis" onChange={event => setDescription(event.target.value)}multiline sx={{width: "90%"}} helperText="Nepovinné">{description}</TextField><br/><br/>

            <Button onClick={() => onClose()} style={{color: mainTheme.palette.secondary.main}}>Zrušiť</Button>
            <Button sx={{float:"right"}} style={{fill: mainTheme.palette.primary.main}} variant="contained" onClick={() => submit()}>Potvrdiť</Button>
        </div>
    )
}