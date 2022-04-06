import React from 'react'


import { DateController} from '../../components/DateController'
import { useGetAbsencesQuery } from '../api/apiSlice'
import { Spinner } from '../../components/Spinner.js'
import {
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    TableHead,
    Button
} from '@mui/material'

import { format, parseISO } from 'date-fns'

export const Btrips = () => {
    const [viewDate, setViewDate] = React.useState(new Date())



    return (
        <div className="app-content">
            <h3>Pracovné cesty</h3>
            <DateController viewDate={viewDate} onChange={setViewDate}/>
            <BtripsLoader viewDate={viewDate}/>
        </div>
    )
}

const BtripsLoader = ({viewDate}) => {
    const{
        data: absences=[],
        isLoading,
        isSuccess,
        isError,
        error,
        isFetching
    } = useGetAbsencesQuery({year: viewDate.getFullYear(), month: viewDate.getMonth()})


    if(isLoading || isFetching){
        return <Spinner />
    }

    return (
        <MemoizedBtrips absences={absences}/>
    )
}

const BtripsDisplayer = ({absences}) => {
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label="users table">
                <TableHead>
                    <TableRow>
                        <TableCell>Autor</TableCell>
                        <TableCell>Dátum</TableCell>
                        <TableCell>Čas</TableCell>
                        <TableCell>Popis</TableCell>
                        <TableCell>Potvrdenie</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { absences.length === 0 ? 
                        <TableRow style={{alignItems: "center"}}colSpan={5}>Žiadne pracovné cesty</TableRow> : null}
                    {
                        absences.map(ab => 
                            <TableRow key={ ab.id }>
                                <TableCell>{ab.user_id}</TableCell>
                                <TableCell>{format(parseISO(ab.date_time), "dd.MM.yyyy")}</TableCell>
                                <TableCell>{ab.from_time} - {ab.to_time}</TableCell>
                                <TableCell>{ab.description}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="success">Potvrdiť</Button>
                                </TableCell>
                            </TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const MemoizedBtrips = React.memo(BtripsDisplayer)


