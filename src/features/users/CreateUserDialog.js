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
import { useCreateUserMutation } from './usersSlice'
import { Spinner } from '../../components/Spinner'
import { toast } from 'react-toastify'

const fields = [
    ["name", "Meno", "text"],
    ["surname", "Priezvisko", "text"],
    ["personal_id", "Osobné čislo", "number"],
    ["username", "Používateľské meno", "text"],
    ["email", "E-mail", "email"],
]

export const CreateUserDialog = ({open, onClose}) => {
    const [formState, setFormState] = React.useState({
        name: "",
        surname: "",
        personal_id: "",
        username: "",
        email: "",
        password: "",
        passagain: "",
        status: 1
    })

    const [createUser, { isLoading }] = useCreateUserMutation()

    const handleChange = ({target: { name, value }}) =>
        setFormState((prev) => ({ ...prev, [name]: value }))

    async function submit(e){
        e.preventDefault()

        if(formState.password !== formState.passagain){
            toast("Nové heslo sa nezhoduje s opakovaným heslom", {type: "warning", id: 40, position: toast.POSITION.TOP})
            return
        }

        try {
            const result = await createUser({
                ...formState
            }).unwrap()
            toast("Používateľ úspešne vytvorený.", {type: "success", id: 33, position: toast.POSITION.TOP})

            onClose()
        }
        catch (err){
            toast("Nepodarilo sa vytvoriť používateľa", {type: "error",  position: toast.POSITION.TOP})
            console.log(err)
        }
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
                <form onSubmit={submit}>
                    {fields.map((field, index) => 
                        (<div key={index} className="labelWithInput">
                            <label htmlFor={field[0]} className="fieldlabel">{field[1]}</label>
                            <TextField 
                                required id={field[0]}
                                name={field[0]}
                                size='small'
                                type={field[2]}
                                value={formState[field[0]]}
                                onChange={handleChange}
                            />
                        </div>)
                    )}
                <div className="labelWithInput">
                    <label htmlFor="password" className="fieldlabel">Heslo</label>
                    <TextField 
                        required id="password"
                        name="password"
                        size='small'
                        type="password"
                        value={formState.password}
                        onChange={handleChange}
                        error={formState.password !== formState.passagain}
                    />
                </div>
                <div className="labelWithInput">
                    <label htmlFor={"passagain"} className="fieldlabel">Heslo znovu:</label>
                    <TextField 
                        required id={"passagain"}
                        name={"passagain"}
                        size='small'
                        type={"password"}
                        value={formState.passagain}
                        onChange={handleChange}
                        error={formState.password !== formState.passagain}
                    />
                </div>

                <div className="labelWithInput">
                    <label htmlFor="rola" className="fieldlabel">Rola: </label>
                    <NativeSelect 
                        id="rola"
                        name="status"
                        defaultValue="1"
                        onChange={handleChange}
                    >   
                        <option value={1}>Používateľ</option>
                        <option value={2}>Administrátor</option>
                        <option value={3}>Sekretárka</option>
                        <option value={4}>Vedúci katedry</option>
                        <option value={0}>Deaktivovaný</option>
                    </NativeSelect>
                </div>
                
                {isLoading ? <Spinner /> : 
                <div className="labelWithInput" style={{marginTop: "2em"}}>
                    <Button onClick={onClose} variant="outlined">Zrušiť</Button>
                    <Button type="submit" color="success" variant="contained">Vytvoriť</Button>
                </div>}
                </form>
            </DialogContent>
        </Dialog>
    )
}