import { 
    Button, 
    FormControl,
    TextField,
    // Input,
} from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectLoggedUser } from '../auth/authSlice'

export const UserProfile = () => {
    const user = useSelector(selectLoggedUser)

    const [open, setOpen] = React.useState(false)
    const [username, setUsername] = React.useState(user.username)
    const [email, setEmail] = React.useState(user.email)
    const [password, setPassword] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")
    const [newPassAgain, setNewPassAgain] = React.useState("")

    function submit(){
        

    }


    if(!user) {
        return (
            <div className="error">Nie ste prihlásený!</div>
        )
    }
    return (
        <div className="app-content" style={{}}>
            <h2 style={{textTransform: "uppercase"}}>Váš profil: {user.name} {user.surname}#{user.personal_id}</h2>
            <h4 style={{margin: "0"}}>Používateľská rola: {user.status}</h4>

            <FormControl>
                <label htmlFor="username" className="profile-label">Prihlasovacie meno: </label>
                <TextField
                    style={{width:"fit-content"}}
                    id="username"
                    placeholder="Používateľské meno"
                    size="small"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="email" className="profile-label">Email</label>
                <TextField
                    style={{width:"fit-content"}}
                    id="email"
                    placeholder="E-mail"
                    size="small"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="newPassword" className="profile-label">Prihlasovacie heslo:</label>
                <TextField
                    style={{width:"fit-content"}}
                    id="newPassword"
                    placeholder="Nové heslo"
                    size="small"
                    value={newPassword} 
                    type="password"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    style={{width:"fit-content", marginTop: "0.5em"}}
                    placeholder="Nové heslo znovu"
                    size="small"
                    value={newPassAgain} 
                    type="password"
                    onChange={(e) => setNewPassAgain(e.target.value)}
                />

                <label htmlFor="password" className="profile-label">Súčasné heslo pre potvrdenie zmien</label>
                <TextField
                    style={{width:"fit-content"}}
                    placeholder="Súčasné heslo"
                    size="small"
                    value={password} 
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" style={{width: "fit-content", marginTop: "2em"}} onClick={submit}>Potvrdiť údaje</Button>
                
            </FormControl>
        </div>
    )
}