import { 
    Button, 
    FormControl,
    TextField,
    // Input,
} from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectLoggedUser } from '../auth/authSlice'
import { useUpdateUserMutation } from './usersSlice'
import { Spinner } from '../../components/Spinner'
import { toast } from 'react-toastify'


export const UserProfile = () => {
    const user = useSelector(selectLoggedUser)

    const [formState, setFormState] = React.useState({
        username: user.username,
        email: user.email,
        password: "",
        newPassword: "",
        newPassAgain: "",
    })

    const handleChange = ({target: { name, value }}) =>
        setFormState((prev) => ({ ...prev, [name]: value }))

    const [updateUser, { isLoading }] = useUpdateUserMutation()
    async function submit(){
        try {
            const result = await updateUser({
                id: user.id,
                username: formState.username,
                email: formState.email,
                password: formState.password,
                newPassword: formState.newPassword
            }).unwrap()

            console.log("RESPONSE",JSON.stringify(result))

            toast("Zmena údajov úspešná", {type: "success", id: 33, position: toast.POSITION.TOP})
        }
        catch (err){
            toast("Zmena údajov neprebehla úspešne. Nesprávne heslo", {type: "error",  position: toast.POSITION.TOP})
            console.log(err)
        }
    }
    if(isLoading){
        return (
            <Spinner />
        )
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
                    name="username"
                    style={{width:"fit-content"}}
                    id="username"
                    placeholder="Používateľské meno"
                    size="small"
                    value={formState.username} 
                    onChange={handleChange}
                />

                <label htmlFor="email" className="profile-label">Email: </label>
                <TextField
                    name="email"
                    style={{width:"fit-content"}}
                    id="email"
                    placeholder="E-mail"
                    size="small"
                    value={formState.email} 
                    onChange={handleChange}
                />

                <label htmlFor="newPassword" className="profile-label">Prihlasovacie heslo:</label>
                <TextField
                    name="newPassword"
                    style={{width:"fit-content"}}
                    id="newPassword"
                    placeholder="Nové heslo"
                    size="small"
                    value={formState.newPassword} 
                    type="password"
                    onChange={handleChange}
                />
                <TextField
                    name="newPassAgain"
                    style={{width:"fit-content", marginTop: "0.5em"}}
                    placeholder="Nové heslo znovu"
                    size="small"
                    value={formState.newPassAgain} 
                    type="password"
                    onChange={handleChange}
                />

                <label htmlFor="password" className="profile-label">Súčasné heslo pre potvrdenie zmien: </label>
                <TextField
                    name="password"
                    id="password"
                    style={{width:"fit-content"}}
                    placeholder="Súčasné heslo"
                    size="small"
                    value={formState.password} 
                    type="password"
                    onChange={handleChange}
                />
                <Button variant="contained" style={{width: "fit-content", marginTop: "2em"}} onClick={submit}>Potvrdiť údaje</Button>
                
            </FormControl>
        </div>
    )
}