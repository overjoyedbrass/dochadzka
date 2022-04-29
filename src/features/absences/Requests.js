import React from 'react'


import { DateController} from '../../components/DateController'
import {
    useGetAbsencesQuery,
    useConfirmAbsenceMutation
} from '../api/apiSlice'
import { Spinner } from '../../components/Spinner.js'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
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
        isFetching,
        refetch
    } = useGetAbsencesQuery({year: viewDate.getFullYear(), rq_only: true})

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
        <TableContainer 
            component={Paper}
        >
            <Table stickyHeader aria-label="users table">
                <TableHead>
                    <TableRow>
                        <TableCell>Dátum</TableCell>
                        <TableCell>Autor</TableCell>
                        <TableCell>Čas</TableCell>
                        <TableCell>Popis</TableCell>
                        <TableCell>Potvrdenie</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { absences.length === 0 ? 
                        <TableRow style={{alignItems: "center"}}>
                            <TableCell colSpan={5}>Žiadne pracovné cesty</TableCell>
                        </TableRow> : null}
                    {
                        absences.map(ab => <ShowRequestRow key={ab.id} absence={ab} />)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}


const ShowRequestRow = ({absence}) => {
    const [ confirmAbsence, { isLoading }] = useConfirmAbsenceMutation()

    async function submitConfirmation(id, newConfirmationValue){
        try{
            await confirmAbsence({
                id: id,
                confirmation: newConfirmationValue,
                year: parseISO(absence.date_time).getFullYear(),
                rq_only: true
            }).unwrap()
        }
        catch(err){
            toast("Potvrdzovanie sa nepodarilo", {type:"error", position: toast.POSITION.TOP})
            console.log(err)
        }
    }

    return (
        <TableRow>
            <TableCell>{format(parseISO(absence.date_time), "dd.MM.yyyy")}</TableCell>
            <TableCell><AbsenceAuthor userId={absence.user_id}/></TableCell>
            <TableCell>{formatFromTo(absence.from_time, absence.to_time)}</TableCell>
            <TableCell>{absence.description}</TableCell>
            <TableCell>
                <Button
                    onClick={() => submitConfirmation(absence.id, absence.confirmation ? 0 : 1)}
                    disabled={isLoading}
                    variant={absence.confirmation ? "contained" : "outlined"}
                    color="success"
                >
                    {absence.confirmation ? "Potvrdené" : "Potvrdiť"}
                </Button>
            </TableCell>
        </TableRow>
    )
}

