import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { selectUserById, useUpdateUserMutation } from './usersSlice.js'

import {
    TextField,
    FormControl,
    NativeSelect,
    Button
} from '@mui/material'

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
    
    const [personalId, setPersonalId] = React.useState(user.personal_id)
    const [name, setName] = React.useState(user.name)
    const [surname, setSurname] = React.useState(user.surname)
    const [email, setEmail] = React.useState(user.email)
    const [username, setUsername] = React.useState(user.username)
    const [password, setPassword] = React.useState("")
    const [role, setRole] = React.useState(user.status)

    const hooks = [setPersonalId, setName, setSurname, setEmail, setUsername, setPassword]
    const values = [personalId, name, surname, email, username, password]


    const [ updateUser, { isLoading }] = useUpdateUserMutation()

    const form_fields = []
    let i = 0
    for(const [key, value] of Object.entries(field_names)){
        const index = i
        form_fields.push((
            <div key={key} className="labelWithInput">
                <label htmlFor={key}>{value}</label>
                <TextField
                    id={key}
                    size="small"
                    onChange={(e) => hooks[index](e.target.value)}
                    value={values[index]}
                    type={ key === "personal_id" ? "number" : "text"}
                    placeholder={value}
                />
            </div>
        ))
        i++
    } 

    function submit(e){
        
    }

    return (
        <div className="app-content">
            <h1>Editácia používateľa: {user.name} {user.surname}</h1>
            <FormControl>
                {form_fields}

                <div className="labelWithInput">
                <label htmlFor="password">Prihlasovacie heslo</label>
                <TextField
                    id="password"
                    size="small"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Nové heslo pre používateľa"
                /></div>


                <div className="labelWithInput">
                    <label htmlFor="rola" className="fieldlabel">Rola: </label>
                    <NativeSelect 
                        size="small"
                        defaultValue="1"
                        id="rola"
                        onChange={(e)=> setRole(e.target.value)}
                    >   
                        <option value={1}>Používateľ</option>
                        <option value={2}>Administrátor</option>
                        <option value={3}>Sekretárka</option>
                        <option value={4}>Vedúci katedry</option>
                        <option value={0}>Deaktivovaný</option>
                    </NativeSelect>
                </div>

                <Button variant="contained" onClick={submit} style={{width: "fit-content"}}> Uložiť zmeny </Button>



            </FormControl>
        </div>
    )
}