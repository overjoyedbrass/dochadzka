import React from 'react'

import {
    FormControl,
    Button,
    TextField,
} from '@mui/material'
import { DateController } from '../../components/DateController'
import { useGetDeadlinesQuery } from '../api/apiSlice'
import { Spinner } from '../../components/Spinner'

const mesiace = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December']

function getInitialDeadlines(){
    const obj = {}
    for(let i = 1; i <= 12; i++){
        obj[i] = 20
    }
    return obj
}

export const EditDeadlines = () => {
    const [viewDate, setViewDate] = React.useState(new Date())

    function submit(e){
        e.preventDefault()
        console.log("submit")
    }

    return (
    <div className="app-content">
        <h1>Termíny pre pridávanie dovolenky a práceneschopnosti</h1>
        <DateController viewDate={viewDate} onChange={setViewDate} type="year"/>
        <DeadlinesLoader viewDate={viewDate}/>
    </div>
    )
}

const DeadlinesLoader = ({viewDate}) => {
    const {
        data: deadlines = [],
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetDeadlinesQuery(viewDate.getFullYear())

    if(isLoading || isFetching){
        return <Spinner />
    }
    return <DeadlinesDisplayer deadlines={deadlines} fromDatabase={deadlines.length}/>
}

const DeadlinesDisplayer = ({deadlines, fromDatabase}) => {
    const ddlines = getInitialDeadlines()
    for(let i = 0; i < deadlines.length; i++){
        const deadline = deadlines[i]
        ddlines[deadline['month']] = deadline['day']
    }

    const [formState, setFormState] = React.useState(ddlines)

    React.useEffect(() => setFormState(ddlines), [deadlines])

    const handleChange = ({target: { name, value }}) =>
        setFormState((prev) => ({ ...prev, [parseInt(name)]: parseInt(value) }))

    function submit(e){
        e.preventDefault()
        console.log("submit")
    }

    return (<>
        {fromDatabase ? null : <h4>Ešte nie je v databáze</h4>}
        <form onSubmit={submit} style={{maxWidth: "20em"}}>
            {mesiace.map((mesiac, index) => 
                <div className="labelWithInput" key={mesiac}>
                    <label htmlFor={mesiac}>{mesiac}</label>
                    <TextField 
                        name={(index+1).toString()}
                        id={mesiac}
                        size="small"
                        type="number"
                        value={formState[index+1]}
                        style={{maxWidth: "4em"}}
                        onChange={handleChange}
                    />
                </div>
            )}
            <Button 
                style={{width: "fit-content"}} 
                variant="contained" 
                type="submit"
                color={fromDatabase ? "primary" : "success"}
            >
                {fromDatabase ? "Zmeniť" : "+ Pridať"}
            </Button>
        </form>
        </>
        )
}