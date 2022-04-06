import React from 'react'
import { useGetHolidaysBudgetQuery } from '../api/apiSlice.js'
import { useSelector} from 'react-redux'
import { selectAllUsers } from '../users/usersSlice'
import { DateController } from '../../components/DateController'

import {
    Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Button, IconButton, TextField
} from '@mui/material'
import { Edit } from '@mui/icons-material'

function roundNumberOrText(number){
    if(isNaN(number) || !number){
        return "Neurčené"
    }
    return Math.round(number)
}
export const Budgets = () => {
    const users = useSelector(selectAllUsers)
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

    return (
        <div className="app-content">
            <h1>Maximálny počet dovoleniek</h1>
            <DateController viewDate={viewDate} type="year" onChange={setViewDate}/>

            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableCell style={{fontSize: "1em"}}>Zamestnanec</TableCell>
                        <TableCell style={{fontSize: "1em"}}>Limit</TableCell>
                        <TableCell style={{fontSize: "1em"}}>Upraviť</TableCell>
                    </TableHead>
                    <TableBody>
                        {users.map(u => (
                            <TableRow>
                                <TableCell style={{fontSize: "1em"}}>{u.surname} {u.name}</TableCell>

                                    {
                                    u.id === editId ? 
                                        <EditBudget 
                                            userId={u.id} 
                                            onClose={() => setEditId(0)}
                                            budget={budgets[u.id] ?? 0}
                                        /> :
                                        <TableCell style={{fontSize: "1em"}}>
                                            {roundNumberOrText(budgets[u.id])}
                                        </TableCell>
                                    }

                                {u.id !== editId ? 
                                <TableCell style={{fontSize: "1em"}}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => setEditId(u.id)}
                                        ><Edit />
                                    </IconButton>
                                </TableCell> : null}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}


const EditBudget = ({userId, onClose, budget}) => {
    const [num, setNum] = React.useState(Math.round(budget))
    const [changed, setChanged] = React.useState(false)
    function submit(e){
        if(!changed){
            onClose()
            return
        }
        
        onClose()
    }

    return (
        <>
        <TableCell>
            <TextField
                type="number"
                size="small"
                value={num}
                style={{maxWidth:"5em"}}
                onChange={(e) => {
                    setNum(e.target.value)
                    setChanged(true)
                }}
            />
        </TableCell>
        <TableCell>
            <Button 
                variant="contained"
                onClick={submit}
            >
                Potvrdiť
            </Button>
        </TableCell>
        </>
    )
}