import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation, useLogoutMutation } from '../../app/services/auth'
import { useGetResetTokenMutation } from '../api/apiSlice.js'
import { selectCurrentAuth, selectLoggedUser, selectUserPerms, setImpersonate } from './authSlice'
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
 import { Spinner } from '../../components/Spinner'

import './Login.css'
import { useSelect } from '@mui/base'

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
    
    async function submit(e){
        e?.preventDefault()
        try {
            const token = await login(formState).unwrap()
            localStorage.token = JSON.stringify(token)
            toast("Prihlásenie úspešné", {type: "success", id: 33, position: toast.POSITION.TOP})
            setFormState({username: "", password: ""})
            setOpen(false)
        } catch (err) {
            toast("Prihlásenie neúspešné. Nesprávne meno alebo heslo", {type: "error",  position: toast.POSITION.TOP})
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
        <form onSubmit={submit}>
        <div className="labelWithInput">
            <label htmlFor="username">Prihlasovacie meno: &nbsp;</label>
            <TextField 
                id="username"
                name="username"
                value={formState.username}
                size="small"
                onChange={handleChange}
                required={true}
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
                required={true}
            />
        </div>
        { isLoading ? <Spinner /> : null}
        <div className="labelWithInput" style={{marginTop: "2em"}}>
            <Button onClick={() => setOpen(false)} variant="outlined">Zavrieť</Button>
            <Button type="submit" variant="contained">Prihlásiť</Button>
        </div>
        </form>
    )

    return (
        <>
            <div 
                className="wrapper" 
                style={{
                    flexFlow: "column", 
                    width: "fit-content",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%"
            }}>
            <Button 
                size="small"
                variant="contained"
                onClick={() => setOpen(true)}
            >
                Prihlásiť sa
            </Button>
            <ResetDialog />
            </div>
            <LoginDialog content={content} open={open} onClose={() => setOpen(false)} />
        </>
    )
}

const ResetDialog = () => {
    const [open, setOpen] = React.useState(false)
    const [email, setEmail] = React.useState("")
    
    const [ sendResetRequest, {  }] = useGetResetTokenMutation()


    const close = () => setOpen(false)

    async function submit(e){
        e.preventDefault()
        try {
            await sendResetRequest(email).unwrap()
            setOpen(false)
            toast("Požiadavka úspešne odoslená. Riaďte sa pokynmi v e-maili.", {type: "success"})
        } catch (err){
            console.log(err)
            toast("Nepodarilo a odoslať požiadavku", {type: "error"})
        }
    }

    return (<>
        <Button style={{fontSize: ".75em "}} onClick={() => setOpen(true)}>
            Zabudnuté heslo?
        </Button>
        <Dialog open={open} onClose={close}>
            <DialogTitle style={{marginRight: "1em"}}>Zabudnuté heslo</DialogTitle>
            <IconButton 
                onClick={close}
                sx={{position: "absolute", top: "4px", right: "4px"}}>
                    <Close />
            </IconButton>
            <DialogContent> 
                <form onSubmit={submit}>
                    <div className="labelWithInput" style={{marginBottom: "1em"}}>
                    <label htmlFor='email'>Email: &nbsp;</label>
                    <TextField 
                        id="email"
                        type="email"
                        placeholder='emailová adresa'
                        value={email}
                        size="small"
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                    /><br /></div>
                    <Button style={{float: "right"}} type="submit" variant="contained">Odoslať</Button>
                </form>
            </DialogContent>
        </Dialog>
    </>)
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

    const user = useSelector(selectLoggedUser)
    const perms = useSelector(selectUserPerms)
    const dispatch = useDispatch()
    const canImpersonate = perms.includes("impersonate")

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [logout, { isLoggingOut }] = useLogoutMutation()

    async function doLogout(){
        try {
            await logout().unwrap()
            toast("Boli ste odhlásený", {type: "warning", id: 33, position: toast.POSITION.TOP})
            navigate("/")
        }
        catch(err){
            console.log(err)
        }
    }    
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
            {
                canImpersonate ?
                <MenuItem onClick={() => {
                    dispatch(setImpersonate(user.id))
                    handleClose()
                }}>
                    Impersonate
                </MenuItem> : null
            }
            <MenuItem onClick={doLogout}>
                    Odhlásiť sa
            </MenuItem>
        </Menu>
        </div>
    )
}


export default Login
