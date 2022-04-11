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
import { DeleteForever, Edit } from '@mui/icons-material'

import { parseISO, format } from 'date-fns'
import { AddHolidayDialog } from './AddHolidayDialog';

export const Holidays = () => {
    const [viewDate, setViewDate] = React.useState(new Date())
    const [open, setOpen] = React.useState(false)

    const {
        data: holidays = [],
        isSuccess,
        isFetching,
        isLoading,
        isError,
    } = useGetHolidaysQuery(viewDate.getFullYear())

   
    return (
        <div className="app-content">
            <h1>Voľné dni</h1>
            <div className="wrapper">
                <DateController viewDate={viewDate} onChange={setViewDate} type="year" button={false}/>
                <div className="wrapper">
                    { holidays.length === 0 ? <Button variant="contained" color="success" style={{marginRight: "4em"}}>Skopírovať z roku 2022</Button> : null }
                    <Button onClick={() => setOpen(true)} variant="contained" color="success">+ Pridať</Button>
                </div>
            </div>
            {
                isLoading || isFetching ? (<Spinner />) :
                <VolneDniDisplayer holidays={holidays} />
            }
            {
                open ? 
                    <AddHolidayDialog 
                        open={open} 
                        year={viewDate.getFullYear()} 
                        onClose={() => setOpen(false)} 
                    /> : null
            }
        </div>
    )
    
}

const VolneDniDisplayer = ({holidays}) => {
    const [editId, setEditId] = React.useState(0)

    return (
        <>
        <TableContainer component={Paper} style={{margin: "1em 0"}}>
            <Table stickyHeader aria-label="users table">
                <TableHead>
                    <TableRow>
                        <TableCell>Dátum</TableCell>
                        <TableCell>Názov</TableCell>
                        <TableCell>Upraviť</TableCell>
                        <TableCell>Odstrániť</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        holidays.map(holid => holid.id !== editId ?
                        (<TableRow key={ holid.id }>
                            <TableCell>{ format(parseISO(holid.date_time), "dd.MM.yyyy") }</TableCell>
                            <TableCell> { holid.description } </TableCell>
                            <TableCell><IconButton color='primary' onClick={() => setEditId(holid.id)}><Edit /></IconButton></TableCell>
                            <TableCell><IconButton color="error"><DeleteForever /></IconButton></TableCell>
                        </TableRow>) :
                        <EditHoliday holiday={holid} onClose={() => setEditId(0)}/>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>

        { holidays.length === 0 ? 
            (<div>
                <h3>Žiadne voľné dni</h3>
            </div>) : null
        }
        </>
    )
}

const EditHoliday = ({holiday, onClose}) => {
    const [date, setDate] = React.useState(parseISO(holiday.date_time))
    const [desc, setDesc] = React.useState(holiday.description)
    const [changed, setChanged] = React.useState(false)

    function submit(e){
        if(!changed){
            onClose()
            return
        }
        onClose()
    }
    return (
        <TableRow key={holiday.id}>
            <TableCell>
            <TextField 
                style={{marginBottom:"0.5em"}} 
                id="date" 
                type="date" 
                size="small" 
                onChange={(event) => {
                    setDate(parseISO(event.target.value))
                    setChanged(true)
                }} 
                value={format(date, "yyyy-MM-dd")} 
            />
            </TableCell>

            <TableCell>
                <TextField 
                    size="small"
                    value={desc}
                    onChange={(e) => {
                        setChanged(true)
                        setDesc(e.target.value)
                    }}
                />
            </TableCell>

            <TableCell colSpan={1}>
                <Button variant="contained" onClick={submit}>Povrdiť</Button>
            </TableCell>
            <TableCell></TableCell>
        </TableRow>
    )
}