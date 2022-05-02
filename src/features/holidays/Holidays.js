import React from 'react'
import { DateController } from '../../components/DateController'
import { useGetHolidaysQuery, useUpdateHolidayMutation, useDeleteHolidayMutation } from '../api/apiSlice';
import { Spinner } from '../../components/Spinner'
import { selectUserPerms, selectLoggedBoolean } from '../auth/authSlice.js'
import { useSelector } from 'react-redux'
import { MessageBox } from '../../components/MessageBox'
import {
    Button,
    TextField,
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
import { toast } from 'react-toastify'
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

    const perms = useSelector(selectUserPerms)
    const isLogged = useSelector(selectLoggedBoolean)

    if(!isLogged){
        return <MessageBox type="warning" message="Nie ste prihlásený"/>
    }
    if(!perms.edit_holidays){
        return <MessageBox type="error" message="Nemáte dostatočné oprávnenia zobraziť túto stránku" />
    }
   
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
    const [deleteHoliday, {isLoading}] = useDeleteHolidayMutation()

    async function deleteSubmit(id){
        try {
            await deleteHoliday(id).unwrap()
            toast("Voľný deň odstránený", {type: "success", id: 33, position: toast.POSITION.TOP})
        }
        catch (err){
            toast("Nepodarilo sa odstrániť voľný deň.", {type: "error",  position: toast.POSITION.TOP})
            console.log(err)
        }
    }
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
                            <TableCell><IconButton disabled={isLoading} onClick={() => deleteSubmit(holid.id)} color="error"><DeleteForever /></IconButton></TableCell>
                        </TableRow>) :
                        <EditHoliday key={holid.id} holiday={holid} onClose={() => setEditId(0)}/>
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

    const [updateHoliday, {isLoading}] = useUpdateHolidayMutation()

    async function submit(e){
        if(!changed){
            onClose()
            return
        }
        try {
            await updateHoliday({
                id: holiday.id,
                date_time: format(date, "yyyy-MM-dd"),
                description: desc
            }).unwrap()
            toast("Voľný deň upravený", {type: "success", id: 33, position: toast.POSITION.TOP})
            onClose()
        }
        catch (err){
            toast("Zmena neprebehla úspešne.", {type: "error",  position: toast.POSITION.TOP})
            console.log(err)
        }
    }
    return (
        <TableRow>
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
                <Button disabled={!desc || isLoading} variant={changed ? "contained" : "outlined"} onClick={submit}>
                    {changed ? "Povrdiť" : "Zrušiť"}
                </Button>
            </TableCell>
            <TableCell></TableCell>
        </TableRow>
    )
}