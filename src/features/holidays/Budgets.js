import React from 'react'
import { useGetHolidaysBudgetQuery } from '../api/apiSlice.js'
import { useSelector} from 'react-redux'
import { selectAllActiveUsers } from '../users/usersSlice'
import { DateController } from '../../components/DateController'
import { Spinner } from '../../components/Spinner'
import {
    Table,  TableBody, TableHead, TableRow, TableCell, Button, IconButton, TextField
} from '@mui/material'
import { Edit } from '@mui/icons-material'

function roundNumberOrText(number){
    if(isNaN(number) || !number){
        return "Neurčené"
    }
    return Math.round(number)
}
export const Budgets = () => {
    const users = useSelector(selectAllActiveUsers)
    const [editId, setEditId] = React.useState(0)
    const [viewDate, setViewDate] = React.useState(new Date())

    const {
        data: budgets={},
        isSuccess,
        isFetching,
        isLoading,
        isError,
        refetch
    } = useGetHolidaysBudgetQuery(viewDate.getFullYear())

    const [formState, setFormState] = React.useState(budgets)
    const handleChange = ({target: { name, value }}) => 
        setFormState((prev) => ({ ...prev, [parseInt(name)]: parseInt(value) }))

    var changed = false
    for(let u of users){
        if(budgets[u.id] !== formState[u.id]){
            changed = true
        }
    }

    React.useEffect(() => {
        setFormState(budgets)
    }, [budgets])
    
    return (
        <div className="app-content">
            <h1>Maximálny počet dovolenkových dní</h1>
            <div className="wrapper">
                <DateController viewDate={viewDate} type="year" onChange={setViewDate}/>
                <Button variant="contained" disabled={!changed}>Uložiť</Button>
            </div>
            { isFetching || isLoading ? <Spinner /> :
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontSize: "1em"}}>Zamestnanec</TableCell>
                        <TableCell style={{fontSize: "1em"}}>Aktuálna hodnota</TableCell>
                        <TableCell style={{fontSize: "1em"}}>Nová hodnota</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(u => (
                        <TableRow key={u.id}>
                            <TableCell style={{fontSize: "1em"}}>{u.surname} {u.name}</TableCell>
                            <TableCell style={{fontSize: "1em"}}>{budgets[u.id] ? budgets[u.id] : "Neurčené"}</TableCell>
                            <TableCell style={{fontSize: "1em"}}>
                                <TextField
                                    name={u.id.toString()}
                                    type="number"
                                    size="small"
                                    value={formState[u.id] ?? 0}
                                    style={{maxWidth:"6em"}}
                                    onChange={ handleChange }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>}
        </div>
    )
}