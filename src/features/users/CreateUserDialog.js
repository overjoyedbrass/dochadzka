import React from 'react'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Button,
    TextField,
    NativeSelect,
} from '@mui/material'
import { Close } from '@mui/icons-material'

const fields = {
    name: "Meno",
    surname: "Priezvisko",
    personal_id: "Osobné čislo",
    username: "Používateľské meno",
    email: "E-mail",
    username: "Používateľské meno",
    password: "Heslo",
    passwordAgain: "Heslo znovu"
}

export const CreateUserDialog = ({open, onClose}) => {
    const [name, setName] = React.useState("")
    const [surname, setSurname] = React.useState("")
    const [personalId,setPersonalId] = React.useState("")
    const [username, setUsername] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [passwordAgain,setPasswordAgain] = React.useState("")
    const [role, setRole] = React.useState(1)

    const values = [name, surname, personalId, username, email, password, passwordAgain]
    const hooks = [setName, setSurname, setPersonalId, setUsername, setEmail, setPassword, setPasswordAgain]
    const formFields = []
    let i = 0
    for (const [key, value] of Object.entries(fields)) {
        const index = i
        formFields.push(
            <div key={key} className="labelWithInput">
                <label htmlFor={key} className="fieldlabel">{value}:</label>
                <TextField 
                    required id={key} 
                    size='small' 
                    type={key.includes("password") ? "password" : "text"}
                    value={values[index]}
                    onChange={(e) => {
                        hooks[index](e.target.value)
                    }}
                />
            </div>
        )
        i++
    }

    function submit(e){
        onClose()
    }

    return (
        <Dialog open={open}>
            <div 
                style={{
                    display: "flex", 
                    width: "100%", 
                    justifyContent: 'space-between',
                }}
            >
                <DialogTitle>Nový používateľ</DialogTitle>
                <IconButton 
                    onClick={onClose}
                    sx={{height: "fit-content", marginTop: "0.5em"}}
                >
                    <Close />
                </IconButton>
            </div>

            <DialogContent> 
                { formFields }
                <div className="labelWithInput">
                    <label htmlFor="rola" className="fieldlabel">Rola: </label>
                    <NativeSelect 
                        id="rola"
                        defaultValue="1"
                        onChange={(e)=> setRole(e.target.value)}
                    >   
                        <option value={1}>Používateľ</option>
                        <option value={2}>Administrátor</option>
                        <option value={3}>Sekretárka</option>
                        <option value={4}>Vedúci katedry</option>
                        <option value={0}>Deaktivovaný</option>
                    </NativeSelect>
                </div>

                <div className="labelWithInput" style={{marginTop: "2em"}}>
                    <Button onClick={onClose} variant="outlined">Zrušiť</Button>
                    <Button onClick={submit} color="success" variant="contained">Vytvoriť</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}