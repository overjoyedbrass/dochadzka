import React from 'react'

import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersSlice'
import { selectLoggedUser } from '../auth/authSlice'
import { CreateUserDialog } from './CreateUserDialog'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
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
import { roles } from '../../helpers/helpers.js'

export const UserManagment = () => {
    const allusers = useSelector(selectAllUsers)
    const loggedUser = useSelector(selectLoggedUser)
    const [open, setOpen] = React.useState(false)
    const [filter, setFilter] = React.useState(2)

    const navigate = useNavigate()
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
    if(!loggedUser){
        return <div className="error">Nie ste prihlásený</div>
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
                <Table stickyHeader aria-label="users table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontSize: "1em"}}>Zamestnanec</TableCell>
                            <TableCell style={{fontSize: "1em"}}>Rola</TableCell>
                            <TableCell style={{fontSize: "1em"}}>Dovolenka</TableCell>
                            <TableCell style={{fontSize: "1em"}}>Upraviť</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.map(user => 
                            <TableRow key={ user.id } onMouseUp={() => navigate("/users/"+user.id)}>
                                <TableCell style={{fontSize: "1em"}}> {user.surname} {user.name} #{user.personal_id} </TableCell>
                                <TableCell style={{fontSize: "1em"}}> { roles[user.status] } </TableCell>
                                <TableCell style={{fontSize: "1em"}}>45/45</TableCell>
                                <TableCell style={{fontSize: "1em"}}>
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