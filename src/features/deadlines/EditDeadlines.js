import React from 'react'

import {
    FormControl,
    Button,
    TextField,
} from '@mui/material'
import { DateController } from '../../components/DateController'

const mesiace = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December']


export const EditDeadlines = () => {
    const [viewDate, setViewDate] = React.useState(new Date())
    const [day, setDay] = React.useState(0)
    const [month, setMonth] = React.useState(0)
    const [name, setName] = React.useState("")
    function submit(e){
        e.preventDefault()
        console.log("submit")
    }

    return (
        <div className="app-content" style={{width: "fit-content"}}>
            <h3>Deadliny pridávania dovolenky a práceneschopnosti</h3>
            <DateController viewDate={viewDate} onChange={setViewDate} type="year"/>
            <form onSubmit={submit}>
                {mesiace.map(mesiac => 
                    <div className="labelWithInput" key={mesiac}>
                        <label htmlFor={mesiac}>{mesiac}</label>
                        <TextField 
                            id={mesiac}
                            size="small"
                            type="number"
                            defaultValue={20}
                            style={{maxWidth: "4em"}}
                        />
                    </div>
                )}
                <div className="wrapper">
                    <Button style={{width: "fit-content"}} variant="contained" type="submit">Potvrdiť</Button>
                </div>
            </form>
        </div>
        )
}