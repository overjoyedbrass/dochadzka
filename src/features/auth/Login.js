import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../app/services/auth'

import { selectCurrentAuth, selectLoggedUser } from './authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'

import './Login.css'

export const Login = () => {
    const navigate = useNavigate()
    const currentToken = useSelector(selectCurrentAuth)
    const currentUser = useSelector(selectLoggedUser)

    const [formState, setFormState] = React.useState({
        username: '',
        password: '',
    })

    const [login, { isLoading }] = useLoginMutation()

    const handleChange = ({target: { name, value }}) =>
        setFormState((prev) => ({ ...prev, [name]: value }))
    
    async function submit(){
        try {
            const token = await login(formState).unwrap()
            localStorage.token = JSON.stringify(token)
            toast("Prihlásenie úspešné", {type: "success", position: toast.POSITION.TOP_RIGHT})
            navigate('/')
        } catch (err) {
            toast("Prihlásenie neúspešné. Nesprávne meno alebo heslo", {type: "error",  position: toast.POSITION.TOP_RIGHT})
        }
    }
    function handleEnter(event){
        if(event.keyCode === 13){
            submit()
        }
    }
    if(currentToken){
        return (
            <div className="loginBar">
                <div className="user-displayer">Prihlásený: {currentUser.name} {currentUser.surname}</div>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        localStorage.token = ""
                        navigate('/')
                        window.location.reload()
                    }}
                >
                    Odhlásiť
                </Button>
            </div>
        )
    }

    return (
        <div className='loginBar'>
            Prihlasovacie meno: 
            <input
                onChange={handleChange}
                name="username"
                type="text"
                placeholder="Email"
            />
            Heslo: <input
                onChange={handleChange}
                name="password"
                type="password"
                placeholder='Enter password'
                onKeyUp={handleEnter}
            />
            <br/>
            <button
                onClick={submit}
            >
            Login
            </button>
        </div>
    )
}

export default Login
