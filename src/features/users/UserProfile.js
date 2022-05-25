import { 
    Button,
    TextField,
    // Input,
} from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectLoggedBoolean, selectLoggedUser } from '../auth/authSlice'
import { useUpdateUserMutation } from './usersSlice'
import { Spinner } from '../../components/Spinner'
import { toast } from 'react-toastify'
import { MessageBox } from '../../components/MessageBox'
import { roles } from '../../config.js'

export const UserProfile = () => {
    const user = useSelector(selectLoggedUser) ?? {}
    const isLogged = useSelector(selectLoggedBoolean)

    const [formState, setFormState] = React.useState({
        username: user.username,
        email: user.email,
        password: "",
        newPassword: "",
        newPassAgain: "",
    })
    const [updateUser, { isLoading }] = useUpdateUserMutation()

    if(!isLogged){
        return <MessageBox type="warning" message="Nie ste prihlásený"/>
    }

    const handleChange = ({target: { name, value }}) =>
        setFormState((prev) => ({ ...prev, [name]: value }))

    function samePasswords(){
        return formState.newPassword === formState.newPassAgain
    }

    async function submit(e){
        e.preventDefault();
        if(formState.newPassword !== formState.newPassAgain){
            toast("Nové heslo sa nezhoduje s opakovaným heslom", {type: "warning", id: 40, position: toast.POSITION.TOP})
            return
        }
        try {
            await updateUser({
                id: user.id,
                ...formState
            }).unwrap()
            toast("Zmena údajov úspešná", {type: "success", id: 33, position: toast.POSITION.TOP})

            setFormState({
                ...formState,
                newPassword: "",
                newPassAgain: "",
                password: ""
            })
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
            <h4 style={{margin: "0"}}>Používateľská rola: {roles[user.status]}</h4>

            <form
                className="form-general"
                onSubmit={submit}
            >
                <label htmlFor="username" className="profile-label">Prihlasovacie meno: </label>
                <TextField
                    name="username"
                    style={{width:"fit-content"}}
                    id="username"
                    placeholder="Používateľské meno"
                    size="small"
                    value={formState.username} 
                    onChange={handleChange}
                    required={true}
                />

                <label htmlFor="email" className="profile-label">Email: </label>
                <TextField
                    name="email"
                    style={{width:"fit-content"}}
                    id="email"
                    type="email"
                    placeholder="E-mail"
                    size="small"
                    value={formState.email} 
                    onChange={handleChange}
                    required={true}
                />

                <label htmlFor="newPassword" className="profile-label">Nové prihlasovacie heslo: (pre žiadnu zmenu nechajte prázdne)</label>
                <TextField
                    name="newPassword"
                    style={{width:"fit-content"}}
                    id="newPassword"
                    placeholder="Nové heslo"
                    size="small"
                    value={formState.newPassword} 
                    type="password"
                    onChange={handleChange}
                    error={!samePasswords()}
                />
                <TextField
                    name="newPassAgain"
                    style={{width:"fit-content", marginTop: "0.5em"}}
                    placeholder="Nové heslo znovu"
                    size="small"
                    value={formState.newPassAgain} 
                    type="password"
                    onChange={handleChange}
                    error={!samePasswords()}
                    helperText={!samePasswords() ? "Heslá sa nezhodujú" : ""}
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
                    required={true}
                />
                <Button type="submit" variant="contained" style={{width: "fit-content", marginTop: "2em"}}>Potvrdiť údaje</Button>
            </form>
        </div>
    )
}