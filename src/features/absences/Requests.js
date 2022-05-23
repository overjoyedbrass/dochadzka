import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserPerms, selectLoggedBoolean } from '../auth/authSlice.js'
import { MessageBox } from '../../components/MessageBox'
import { DateController } from '../../components/DateController'

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
    const [filter, setFilter] = React.useState(0)

    const perms = useSelector(selectUserPerms)
    const isLogged = useSelector(selectLoggedBoolean)
    
    const {
        data=[],
        isLoading,
        // isSuccess,
        // isError,
        // error,
        isFetching,
        // refetch
    } = useGetAbsencesQuery({year: viewDate.getFullYear(), rq_only: true})

    if(!isLogged){
        return <MessageBox type="warning" message="Nie ste prihlásený"/>
    }
    if(!perms.includes("manage_requests")){
        return <MessageBox type="error" message="Nemáte dostatočné oprávnenia zobraziť túto stránku" />
    }

    let absences;
    if(filter < 2)
        absences = data.filter(ab => ab.confirmation === filter)
    else absences = data
    return (
        <div className="app-content">
            <h1>Žiadosti</h1>
            <div className="wrapper" style={{marginBottom: "0.25em"}}>
                <DateController viewDate={viewDate} onChange={setViewDate} type="year"/>
                <ButtonGroup>
                    <Button onClick={() => setFilter(0)} variant={filter === 0 ? "contained" : "outlined"}>Nepotvrdené</Button>
                    <Button onClick={() => setFilter(1)} variant={filter === 1 ? "contained" : "outlined"}>Potvrdené</Button>
                    <Button onClick={() => setFilter(2)} variant={filter === 2 ? "contained" : "outlined"}>Všetky</Button>
                </ButtonGroup>
            </div>
            { isLoading || isFetching ? <Spinner /> :
            <TableContainer component={Paper}>
                <Table 
                    stickyHeader aria-label="users table"
                    sx={{
                        "& .MuiTableRow-root:focus-within, & .MuiTableRow-root:hover": {
                        backgroundColor: "primary.highlight",
                    }}}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Dátum</TableCell>
                            <TableCell>Autor</TableCell>
                            <TableCell>Typ</TableCell>
                            <TableCell>Čas</TableCell>
                            <TableCell>Popis</TableCell>
                            <TableCell>Potvrdenie</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { absences.length === 0 ? 
                            <TableRow style={{alignItems: "center"}}>
                            <TableCell colSpan={6}>Žiadne žiadosti</TableCell>
                            </TableRow> : null}
                        { absences.map(ab => <ShowRequestRow key={ab.id} absence={ab} />) }
                    </TableBody>
                </Table>
            </TableContainer>}
        </div>
    )
}

const ShowRequestRow = ({absence}) => {
    const [ confirmAbsence, { isLoading }] = useConfirmAbsenceMutation()

    const isConfirmed = absence.confirmation

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
            <TableCell>{absence.name}</TableCell>
            <TableCell>{formatFromTo(absence.from_time, absence.to_time)}</TableCell>
            <TableCell>{absence.description}</TableCell>
            <TableCell>
                <Button
                    onClick={() => submitConfirmation(absence.id, isConfirmed ? 0 : 1)}
                    disabled={isLoading}
                    variant={isConfirmed ? "contained" : "outlined"}
                    color="success"
                >
                    { isConfirmed ? "Potvrdené" : "Potvrdiť"}
                </Button>
            </TableCell>
        </TableRow>
    )
}

