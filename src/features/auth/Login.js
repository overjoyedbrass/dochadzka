import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../app/services/auth'

import { selectCurrentAuth, selectLoggedUser } from './authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { 
    Button,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem
 } from '@mui/material'
 import { Close, AccountCircle } from '@mui/icons-material'

import './Login.css'

export const Login = () => {
    const navigate = useNavigate()
    const currentToken = useSelector(selectCurrentAuth)
    const currentUser = useSelector(selectLoggedUser)

    const [open, setOpen] = React.useState(false)

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
            toast("Prihlásenie úspešné", {type: "success", id: 33, position: toast.POSITION.TOP_RIGHT})
            setOpen(false)
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
            <div className="user-panel">
                {currentUser.username}#{currentUser.personal_id}
                <DropMenu navigate={navigate}/>
            </div>
        )
    }
    let content = (
        <>
        <div className="labelWithInput">
            <label htmlFor="username">Prihlasovacie meno: </label>
            <TextField 
                id="username"
                name="username"
                value={formState.username}
                size="small"
                onChange={handleChange}
            />
        </div>
        <div className="labelWithInput">
            <label htmlFor="password">Heslo: </label>
            <TextField
                id="password"
                name="password"
                value={formState.password}
                type="password"
                size="small"
                onChange={handleChange}
                onKeyDown={handleEnter}
            />
        </div>
        <div className="labelWithInput" style={{marginTop: "2em"}}>
            <Button onClick={() => setOpen(false)} variant="outlined">Zavrieť</Button>
            <Button onClick={submit} variant="contained">Prihlásiť</Button>
        </div>
        </>
    )

    return (
        <>
            <Button 
                size="small"
                style={{margin: "1em 1em 0 0"}} 
                variant="contained"
                onClick={() => setOpen(true)}
            >
                Prihlásiť sa
            </Button>
            <LoginDialog content={content} open={open} onClose={() => setOpen(false)} />
        </>
    )
}

const LoginDialog = ({open, content, onClose}) => {
    return (
        <Dialog open={open}>
            <div 
                style={{
                    display: "flex", 
                    width: "100%", 
                    justifyContent: 'space-between',
                }}
            >
                <DialogTitle>Prihlásenie</DialogTitle>
                <IconButton 
                    onClick={onClose}
                    sx={{height: "fit-content", marginTop: "0.5em"}}
                >
                    <Close />
                </IconButton>
            </div>

            <DialogContent> 
                {content}
            </DialogContent>
        </Dialog>
    )
}

const DropMenu = ({navigate}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return (
        <div>
        <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            color="primary"
        >
            <AccountCircle />
        </IconButton>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={() => {
                handleClose()
                navigate("/profile")
            }}>
                Váš profil
            </MenuItem>

            <MenuItem 
                onClick={() => {
                    handleClose()
                    localStorage.token = ""
                    navigate("/")
                    window.location.href = "/"
                }}>
                    Odhlásiť sa
            </MenuItem>
        </Menu>
        </div>
    )
}


export default Login
