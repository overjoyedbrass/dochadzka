import React from 'react'

import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersSlice'
import { selectLoggedUser } from '../auth/authSlice'
import { CreateUserDialog } from './CreateUserDialog'
import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TableHead,
    Paper,
    Button
} from '@mui/material'

export const UserManagment = () => {
    const users = useSelector(selectAllUsers)
    const loggedUser = useSelector(selectLoggedUser)
    const [open, setOpen] = React.useState(false)
    if(!loggedUser){
        return <div className="error">Nie ste prihlásený</div>
    }
    return (
        <div className="app-content">
            <h3 style={{flex: "0 0 auto"}}>Správa používateľov</h3>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.map(user => 
                            <TableRow key={ user.id }>
                                <TableCell>{user.username}#{user.personal_id}</TableCell>
                                <TableCell>{user.name} {user.surname}</TableCell>
                                <TableCell> { user.status } </TableCell>
                                <TableCell>45/45 <Button>Edit</Button></TableCell>
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