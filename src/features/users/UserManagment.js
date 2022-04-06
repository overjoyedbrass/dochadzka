import React from 'react'

import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersSlice'
import { selectLoggedUser } from '../auth/authSlice'
import { CreateUserDialog } from './CreateUserDialog'
// import { useNavigate } from 'react-router-dom'
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
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit';

export const UserManagment = () => {
    const users = useSelector(selectAllUsers)
    const loggedUser = useSelector(selectLoggedUser)
    const [open, setOpen] = React.useState(false)

    if(!loggedUser){
        return <div className="error">Nie ste prihlásený</div>
    }
    return (
        <div className="app-content">
            <h1 style={{flex: "0 0 auto"}}>Správa používateľov</h1>
            <Button 
                style={{width:"fit-content", margin: "1em 0"}} 
                variant="contained"
                color="success"
                onClick={() => setOpen(true)}
            >
                Vytvoriť používateľa
            </Button>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="users table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Používateľ</TableCell>
                            <TableCell>Celé meno</TableCell>
                            <TableCell>Rola</TableCell>
                            <TableCell>Dovolenka</TableCell>
                            <TableCell>Upraviť</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.map(user => 
                            <TableRow key={ user.id }>
                                <TableCell>
                                    <Link to={"/users/"+user.id} style={{textDecoration: "none", color: "blue"}}>
                                        {user.username}#{user.personal_id}
                                    </Link>
                                </TableCell>
                                <TableCell>{user.name} {user.surname}</TableCell>
                                <TableCell> { user.status } </TableCell>
                                <TableCell>45/45</TableCell>
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