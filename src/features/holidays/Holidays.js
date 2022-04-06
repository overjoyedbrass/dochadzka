import React from 'react'
import { DateController } from '../../components/DateController'
import { useGetHolidaysQuery } from '../api/apiSlice';
import { Spinner } from '../../components/Spinner'
import {
    Button,
    TextField,
    FormControl,
    TableCell,
    Table,
    TableBody,
    TableRow,
    Paper,
    TableHead,
    TableContainer,
    IconButton,

} from '@mui/material'
import { DeleteForever } from '@mui/icons-material'

import { parseISO, format } from 'date-fns'

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const Holidays = () => {
    const [viewDate, setViewDate] = React.useState(new Date())
    const [day, setDay] = React.useState(1)
    const [month, setMonth] = React.useState(1)
    const [name, setName] = React.useState("")

    const {
        data: holidays = [],
        isSuccess,
        isFetching,
        isLoading,
        isError,
    } = useGetHolidaysQuery(viewDate.getFullYear())

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
                <label htmlFor="name">Názov sviatku / voľného dňa: </label>
                <TextField
                    id="name"
                    size="small"
                    value={name}
                    placeholder="Názov sviatku"
                    onChange={(e) => setName(e.target.value)}
                />
                </div>

                
                <Button 
                    onClick={submit} 
                    type="submit" 
                    variant="contained" 
                    color="success" 
                    style={{width: "fit-content", marginTop: "1em"}}
                >
                    + Pridať
                </Button>
            </FormControl>
            {
                isLoading || isFetching ? (<Spinner />) :
                <VolneDniDisplayer holidays={holidays} />
            }
        </div>
    )
    
}


const VolneDniDisplayer = ({holidays}) => {
    return (
        <TableContainer component={Paper} style={{margin: "1em 0"}}>
            <Table stickyHeader aria-label="users table">
                <TableHead>
                    <TableRow>
                        <TableCell>Dátum</TableCell>
                        <TableCell>Názov</TableCell>
                        <TableCell>Odstrániť</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        holidays.map(holid => 
                        <TableRow key={ holid.id }>
                            <TableCell>{ format(parseISO(holid.date_time), "dd.MM.yyyy") }</TableCell>
                            <TableCell> { holid.description } </TableCell>
                            <TableCell><IconButton color='error'><DeleteForever /></IconButton></TableCell>
                        </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}