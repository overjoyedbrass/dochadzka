import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageBox } from '../../components/MessageBox';
import jwt_decode from 'jwt-decode'
import { useResetPasswordMutation } from '../api/apiSlice.js'
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';
import { Button } from '@mui/material'
function useQuery() {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const PasswordReset = () => {
    const query = useQuery()
    const token = query.get("token")
    const [formState, setFormState] = React.useState({
        pass:       "",
        passagain:  ""
    })

    const navigate = useNavigate()
    const [ changePassword ] = useResetPasswordMutation()


    let jwt_data;
    try {
        jwt_data = jwt_decode(token)
        if(!jwt_data.id) throw new Error("Token is missing user ID")
        if (jwt_data.exp * 1000 < Date.now()) {
            throw new Error("JWT expired")
        }
    } catch (err){
        return <MessageBox message='Invalid token' type="error"/>
    }


    async function submit(e){
        e.preventDefault()
        if(formState.pass !== formState.passagain){
            toast("Heslá sa nezhodujú", { type: "warning" })
            return
        }
        try {
            await changePassword({ password: formState.pass, token: token, id: jwt_data.id}).unwrap()
            toast("Resetovanie hesla úspešné", { type: "success" })
            navigate("/")
        } catch (err) {
            toast("Resetovanie sa nepodarilo", { type: "error" })
        }
    }
    // const handleChange = ({target: { name, value }}) =>
    //     setFormState((prev) => ({ ...prev, [name]: value }))
    const handleChange = (e) => setFormState({...formState, [e.target.name]: e.target.value})

    

    return (
        <div className="app-content">
            <h1>Resetovanie hesla</h1>
            <form onSubmit={submit} style={{maxWidth: "23em"}}>
                <div className="labelWithInput">
                    <label htmlFor="pass">Nové heslo: &nbsp;</label>
                    <TextField
                        id="pass"
                        name="pass"
                        type="password"
                        size="small"
                        value={formState.pass}
                        onChange={handleChange}
                    />
                </div>
                <div className="labelWithInput">
                    <label htmlFor="passagain">Nové heslo znovu: &nbsp;</label>
                    <TextField
                        id="passagain"
                        name="passagain"
                        type="password"
                        size="small"
                        value={formState.passagain}
                        onChange={handleChange}
                    />
                </div>
                <Button style={{float: "right"}} type="submit" variant="contained">Potvrdiť</Button>
            </form>
        </div>
    )
}


