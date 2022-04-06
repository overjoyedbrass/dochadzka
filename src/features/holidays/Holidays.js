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
                <Button onClick={() => setOpen(true)} variant="contained" color="success">+ Pridať</Button>
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
    return (
        <>
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

        { holidays.length === 0 ? 
            (<div>
                <h3>Žiadne voľné dni</h3>
                <Button variant="contained" color="success">Skopírovať z posledného vyplneného roku</Button>
            </div>) : null
        }
        </>
    )
}