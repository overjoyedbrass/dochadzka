import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { selectUserById, useUpdateUserMutation } from './usersSlice.js'
import { toast } from 'react-toastify'
import {
    TextField,
    FormControl,
    NativeSelect,
    Button
} from '@mui/material'
import { Spinner } from '../../components/Spinner.js'

const field_names = {
    personal_id: "Osobné číslo",
    name: "Meno",
    surname: "Priezvisko",
    email: "Email",
    username: "Prihlasovacie meno",
}

export const UserEdit = () => {
    const { id } = useParams()
    const user = useSelector(state => selectUserById(state, id))

    if(!user){
        return (
            <div className="app-content">
                <h3>Používateľ s ID {id} neexistuje.</h3>
            </div>
        )
    }
    return (
        <UserEditForm user={user}/>
    )

}

const UserEditForm = ({user}) => {
    const [formState, setFormState] = React.useState({
        personalId: user.personal_id,
        name:       user.name,
        surname:    user.surname,
        email:      user.email,
        username:   user.username,
        password:   "",
        status:     user.status
    })

    const handleChange = ({target: { name, value }}) =>
        setFormState((prev) => ({ ...prev, [name]: value }))

    const [ updateUser, { isLoading }] = useUpdateUserMutation()

    async function submit(e){
        e.preventDefault()

        try {
            const result = await updateUser({
                id: user.id,
                ...formState,
                password: formState.password ? formState.password : null
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
            toast("Zmena údajov neprebehla úspešne.", {type: "error",  position: toast.POSITION.TOP})
            console.log(err)
        }
    }

    return (
        <div className="app-content">
            <h1>Editácia používateľa: {user.name} {user.surname}</h1>
            <form onSubmit={submit}>
                <div className="labelWithInput">
                    <label htmlFor="personalId">Osobné číslo</label>
                    <TextField
                        id="personalId"
                        name="personalId"
                        size="small"
                        onChange={handleChange}
                        value={formState.personalId}
                        required={true}
                        placeholder="Osobné číslo"
                    />
                </div>

                
                <div className="labelWithInput">
                    <label htmlFor="name">Meno</label>
                    <TextField
                        id="name"
                        name="name"
                        size="small"
                        onChange={handleChange}
                        value={formState.name}
                        required={true}
                        placeholder="Meno"
                    />
                </div>
                
                <div className="labelWithInput">
                    <label htmlFor="surname">Priezvisko</label>
                    <TextField
                        id="surname"
                        name="surname"
                        size="small"
                        onChange={handleChange}
                        value={formState.surname}
                        required={true}
                        placeholder="Priezvisko"
                    />
                </div>
                
                <div className="labelWithInput">
                    <label htmlFor="email">Email</label>
                    <TextField
                        id="email"
                        name="email"
                        size="small"
                        onChange={handleChange}
                        value={formState.email}
                        required={true}
                        placeholder="Email"
                    />
                </div>

                <div className="labelWithInput">
                    <label htmlFor="username">Prihlasovacie meno</label>
                    <TextField
                        id="username"
                        name="username"
                        size="small"
                        onChange={handleChange}
                        value={formState.username}
                        required={true}
                        placeholder="Prihlasovacie meno"
                    />
                </div>

                <div className="labelWithInput">
                    <label htmlFor="password">Prihlasovacie heslo</label>
                    <TextField
                        id="password"
                        name="password"
                        size="small"
                        onChange={handleChange}
                        value={formState.password}
                        type="password"
                        placeholder="Nové heslo pre používateľa"
                    />
                </div>


                <div className="labelWithInput">
                    <label htmlFor="rola" className="fieldlabel">Rola: </label>
                    <NativeSelect
                        name="status"
                        size="small"
                        value={formState.status}
                        id="rola"
                        onChange={handleChange}
                    >   
                        <option value={1}>Používateľ</option>
                        <option value={2}>Administrátor</option>
                        <option value={3}>Sekretárka</option>
                        <option value={4}>Vedúci katedry</option>
                        <option value={0}>Deaktivovaný</option>
                    </NativeSelect>
                </div>

                { isLoading ? <Spinner /> :
                <Button 
                    variant="contained" 
                    type="submit" 
                    style={{width: "fit-content"}}
                >    
                    Potvrdiť údaje 
                </Button>
                }

            </form>
        </div>
    )
}