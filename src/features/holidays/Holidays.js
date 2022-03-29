import React from 'react'
import { DateController } from '../../components/DateController'

import {
    Button,
    TextField,
    FormControl
} from '@mui/material'


const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const Holidays = () => {
    const [viewDate, setViewDate] = React.useState(new Date())
    const [day, setDay] = React.useState(1)
    const [month, setMonth] = React.useState(1)
    const [name, setName] = React.useState("")

    // HOOK LOAD HOLIDAYS
    // SUBMIT ON CLICK REFETCH // INVALIDATES TAGS

    function submit(e){
        e.preventDefault()
        console.log("submit")
    }
    return (
        <div className="app-content">
            <h3>Voľné dni</h3>
            <DateController viewDate={viewDate} onChange={setViewDate} type="year" button={false}/>

            <h4>Pridať voľný deň do roku {viewDate.getFullYear()}</h4>
            <FormControl style={{maxWidth: "20em"}}>
                <div className="labelWithInput">
                <label htmlFor="day">Deň: </label>
                <TextField 
                    id="day"
                    size="small"
                    value={day}
                    type="number"
                    style={{width: "4em"}}
                    onChange={(e) => setDay(clamp(1, parseInt(e.target.value), 31))}
                />
                </div>

                <div className="labelWithInput">
                <label htmlFor="month">Mesiac: </label>
                <TextField
                    id="month"
                    size="small"
                    value={month}
                    type="number"
                    style={{width: "4em"}}
                    onChange={(e) => setMonth(clamp(1, parseInt(e.target.value), 12))}
                />
                </div>

                <div className="labelWithInput">
                <label htmlFor="name">Názov sviatku voľného dňa: </label>
                <TextField
                    id="name"
                    size="small"
                    value={name}
                    placeholder="Názov sviatku/voľného dňa"
                    onChange={(e) => setName(e.target.value)}
                />
                </div>

                
                <div className="wrapper">
                    <Button 
                        onClick={submit} 
                        type="submit" 
                        variant="contained" 
                        color="success" 
                        style={{width: "fit-content"}}
                    >
                        + Pridať
                    </Button>
                </div>
            </FormControl>

        </div>
    )
    
}