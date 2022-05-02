import React from 'react'

import { useSelector } from 'react-redux'
import { selectUserPerms, selectLoggedBoolean } from '../auth/authSlice.js'
import { MessageBox } from '../../components/MessageBox'

import { useGetHolidaysBudgetQuery, useInsertHolidaysBudgetMutation } from '../api/apiSlice.js'
import { selectAllActiveUsers } from '../users/usersSlice'
import { DateController } from '../../components/DateController'
import { Spinner } from '../../components/Spinner'
import {
    Table,  TableBody, TableHead, TableRow, TableCell, Button, IconButton, TextField, TableContainer, Paper
} from '@mui/material'
import { toast } from 'react-toastify'

function roundNumberOrText(number){
    if(isNaN(number) || !number){
        return "Neurčené"
    }
    return Math.round(number)
}
export const Budgets = () => {
    const users = useSelector(selectAllActiveUsers)    
    const [viewDate, setViewDate] = React.useState(new Date())

    const {
        data: budgets={},
        isFetching,
        isLoading,
        isError,
    } = useGetHolidaysBudgetQuery(viewDate.getFullYear())

    const [formState, setFormState] = React.useState(budgets)
    const handleChange = ({target: { name, value }}) => 
        setFormState((prev) => ({ ...prev, [parseInt(name)]: parseInt(value) }))

    React.useEffect(() => {
        if(!isError && budgets != {}){
            setFormState(budgets)
        }
    }, [budgets])

    var changed = false
    for(let u of users){
        if(budgets[u.id] !== formState[u.id]){
            changed = true
        }
    }    
    const [ insertHoliday , { isInserting }] = useInsertHolidaysBudgetMutation()

    const perms = useSelector(selectUserPerms)
    const isLogged = useSelector(selectLoggedBoolean)

    if(!isLogged){
        return <MessageBox type="warning" message="Nie ste prihlásený"/>
    }
    if(!perms.edit_budgets){
        return <MessageBox type="error" message="Nemáte dostatočné oprávnenia zobraziť túto stránku" />
    }

    async function submit(e){
        e.preventDefault();
        try {
            await insertHoliday({year: viewDate.getFullYear(), ...formState}).unwrap()
            toast("Počty dovolenkových dní nastavené!", {type:"success"})
        }
        catch(err){
            toast("Chyba na strane servera.", {type:"error"})
        }
    }

    return (
        <div className="app-content">
            <h1>Maximálny počet dovolenkových dní</h1>
            <form 
                onSubmit={submit}
                style={{flex: "0 1 auto", display: "flex", flexFlow: "column", overflowY: "auto"}}
            >
            <div className="wrapper">
                <DateController viewDate={viewDate} type="year" onChange={setViewDate}/>
                {isInserting ? <Spinner /> : <Button type={"submit"} variant="contained" disabled={!changed}>Uložiť</Button> }
            </div>
            { isFetching || isLoading ? <Spinner /> :
            <TableContainer 
                component={Paper}
                sx={{width: "fit-content", margin: "0 auto"}}
            >
            <Table 
                stickyHeader
                // sx={{width: "fit-content"}}
            >
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
                                    value={formState[u.id] ?? ""}
                                    style={{maxWidth:"6em"}}
                                    onChange={ handleChange }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>}
            </form>
        </div>
    )
}