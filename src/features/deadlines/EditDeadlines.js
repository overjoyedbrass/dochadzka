import React from 'react'

import { useSelector } from 'react-redux'
import { selectUserPerms, selectLoggedBoolean } from '../auth/authSlice.js'

import {
    Table,
    TableRow,
    TableCell,
    TableHead,
    Paper,
    TableBody,
    Button,
    TextField,
    TableContainer,
} from '@mui/material'
import { DateController } from '../../components/DateController'
import { useGetDeadlinesQuery, useInsertDeadlinesMutation } from '../api/deadlineSlice'
import { Spinner } from '../../components/Spinner'
import { toast } from 'react-toastify'

import { MessageBox } from '../../components/MessageBox'

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
    const {
        data: deadlines = [],
        isFetching,
        isLoading,
        // isSuccess,
        // isError,
        // error
    } = useGetDeadlinesQuery(viewDate.getFullYear())

    const ddlines = getInitialDeadlines()
    for(let i = 0; i < deadlines.length; i++){
        const deadline = deadlines[i]
        ddlines[deadline['month']] = deadline['day']
    }
    const [formState, setFormState] = React.useState(ddlines)
    const [insertDeadlines] = useInsertDeadlinesMutation()
    const handleChange = ({target: { name, value }}) =>
        setFormState((prev) => ({ ...prev, [parseInt(name)]: value ? parseInt(value) : ""}))

    React.useEffect(() => {
        if(deadlines.length){
            setFormState(ddlines)
        }
    }, [deadlines, ddlines])


    async function submit(e){
        e.preventDefault()
        try {
            await insertDeadlines({year: year, ...formState}).unwrap()
            toast("Termíny úspešne nastavené", {type: "success", id: 33, position: toast.POSITION.TOP})
        }
        catch (err){
            toast("Nepodarilo sa zmeniť termíny.", {type: "error",  position: toast.POSITION.TOP})
            console.log(err)
        }
    }

    const inDatabase = Boolean(deadlines.length)
    const year = viewDate.getFullYear()

    return (
        <div className="app-content">
            <h1>Termíny pre pridávanie dovolenky a práceneschopnosti</h1>
            <form 
                onSubmit={submit} 
                style={{flex: "0 1 auto", display: "flex", flexFlow: "column", overflowY: "auto"}}
            >
                <div className="wrapper">
                    <DateController viewDate={viewDate} onChange={setViewDate} type="year"/>
                    <Button variant="contained" type="submit">Zmeniť</Button>
                </div>
                {inDatabase ? null : <h4>Ešte nie je v databáze</h4>}
                { isLoading || isFetching ? <Spinner /> :
                <TableContainer 
                    component={Paper}
                    sx={{
                        "& .MuiTableRow-root:focus-within, & .MuiTableRow-root:hover": {
                            backgroundColor: "primary.highlight",
                    }}}
                >
                    <Table 
                        stickyHeader 
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Mesiac</TableCell>
                                <TableCell>Hodnota</TableCell>
                            </TableRow>
                        </TableHead>
                    <TableBody>
                    {mesiace.map((mesiac, index) => 
                        <TableRow key={index}>
                            <TableCell>{mesiace[index]}</TableCell>
                            <TableCell>
                                <TextField 
                                    name={(index+1).toString()}
                                    id={mesiac}
                                    size="small"
                                    type="number"
                                    value={formState[index+1]}
                                    style={{maxWidth: "6em"}}
                                    onChange={handleChange}
                                    required={true}
                                />
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </TableContainer>}
            </form>
        </div>
    )
}