import React from 'react'


import { DateController} from '../../components/DateController'
import { useGetRequestsQuery } from '../api/apiSlice'
import { Spinner } from '../../components/Spinner.js'
import { useLocation } from 'react-router-dom'

import {
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    TableHead,
    Button,
    ButtonGroup
} from '@mui/material'
import { format, parseISO } from 'date-fns'
import { AbsenceAuthor } from './AbsenceAuthor'
import { formatFromTo } from '../../helpers/helpers.js'
function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}



export const Requests = () => {
    const query = useQuery()
    const year = query.get("year")

    const [viewDate, setViewDate] = React.useState(year ? new Date(year) : new Date())
    const [filter, setFilter] = React.useState(2)

    return (
        <div className="app-content">
            <h1>Žiadosti</h1>
            <div className="wrapper" style={{marginBottom: "0.25em"}}>
                <DateController viewDate={viewDate} onChange={setViewDate} type="year"/>
                <ButtonGroup>
                    <Button onClick={() => setFilter(2)} variant={filter === 2 ? "contained" : "outlined"}>Všetky</Button>
                    <Button onClick={() => setFilter(1)} variant={filter === 1 ? "contained" : "outlined"}>Potvrdené</Button>
                    <Button onClick={() => setFilter(0)} variant={filter === 0 ? "contained" : "outlined"}>Nepotvrdené</Button>
                </ButtonGroup>
            </div>

            <RequestsLoader viewDate={viewDate} filter={filter}/>
        </div>
    )
}

const RequestsLoader = ({viewDate, filter}) => {
    const{
        data,
        isLoading,
        isSuccess,
        isError,
        error,
        isFetching
    } = useGetRequestsQuery(viewDate.getFullYear())

    if(isLoading || isFetching){
        return <Spinner />
    }
    let absences;
    if(filter < 2)
        absences = data.filter(ab => ab.confirmation === filter)
    else absences = data

    return (
        <RequestDisplayer absences={absences}/>
    )
}

const RequestDisplayer = ({absences}) => {
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
                        <TableRow style={{alignItems: "center"}} colSpan={5}>Žiadne pracovné cesty</TableRow> : null}
                    {
                        absences.map(ab => 
                            <TableRow key={ ab.id }>
                                <TableCell>{format(parseISO(ab.date_time), "dd.MM.yyyy")}</TableCell>
                                <TableCell><AbsenceAuthor userId={ab.user_id}/></TableCell>
                                <TableCell>{formatFromTo(ab.from_time, ab.to_time)}</TableCell>
                                <TableCell>{ab.description}</TableCell>
                                <TableCell>
                                    {ab.confirmation ? 
                                    <Button variant="contained" color="success">Potvrdené</Button> :
                                    <Button variant="outlined" color="success">Potvrdiť</Button> 
                                    }
                                </TableCell>
                            </TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}


