import React from 'react'

import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersSlice'
import { CreateUserDialog } from './CreateUserDialog'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { selectUserPerms, selectLoggedBoolean } from '../auth/authSlice.js'
import { useGetHolidaysBudgetQuery } from '../api/budgetSlice'

import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TableHead,
    Paper,
    Button,
    IconButton,
    ButtonGroup
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { roles } from '../../config.js'

export const UserManagment = () => {
    const allusers = useSelector(selectAllUsers)
    const [open, setOpen] = React.useState(false)
    const [filter, setFilter] = React.useState(2)
    const navigate = useNavigate()

    const perms = useSelector(selectUserPerms)

    const sekretarka = perms.includes("edit_budgets")
    const {
        data: budgets={}
    } = useGetHolidaysBudgetQuery((new Date()).getFullYear())

    let users
    if(filter === 0){
        users = allusers.filter(u => u.status === 0)
    }
    else if(filter === 1){
        users = allusers.filter(u => u.status > 0)
    }
    else {
        users = allusers
    }
    return (
        <div className="app-content">
            <h1 style={{flex: "0 0 auto"}}>Správa používateľov</h1>
            <div className="wrapper">
                <ButtonGroup>
                    <Button variant={filter === 2 ? "contained" : "outlined"} onClick={() => setFilter(2)}>Všetci</Button>
                    <Button variant={filter === 1 ? "contained" : "outlined"} onClick={() => setFilter(1)}>Aktívní</Button>
                    <Button variant={filter === 0 ? "contained" : "outlined"} onClick={() => setFilter(0)}>Deaktivovaní</Button>
                </ButtonGroup>
                <Button 
                    style={{width:"fit-content", margin: "1em 0"}} 
                    variant="contained"
                    color="success"
                    onClick={() => setOpen(true)}
                >
                    + Vytvoriť používateľa
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table 
                    stickyHeader 
                    aria-label="users table" 
                    sx={{
                        "& .MuiTableRow-root:hover": {
                        backgroundColor: "primary.highlight",
                    }}}
                >
                    <TableHead>
                        <TableRow className="tablerow-hover">
                            <TableCell>Zamestnanec</TableCell>
                            <TableCell>Osobné číslo</TableCell>
                            <TableCell>Rola</TableCell>
                            { sekretarka ? <TableCell>Dovolenka</TableCell> : null }
                            <TableCell>Upraviť</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.map(user => 
                            <TableRow key={ user.id } onMouseUp={() => navigate("/users/"+user.id)}>
                                <TableCell> {user.surname} {user.name}</TableCell>
                                <TableCell>{user.personal_id}</TableCell>
                                <TableCell> { roles[user.status] } </TableCell>
                                { sekretarka ? <TableCell>{budgets[user.id]?.used ?? 0}/{budgets[user.id]?.num ?? 0}</TableCell> : null}
                                <TableCell>
                                    <IconButton><Link to={"/users/"+user.id} style={{textDecoration: "none", color: "blue"}}>
                                        <EditIcon />
                                    </Link></IconButton>
                                </TableCell>
                            </TableRow>
                            )
                        } 
                    </TableBody>
                </Table>
            </TableContainer>
            <CreateUserDialog open={open} onClose={() => setOpen(false)}/>
        </div>
    )
}