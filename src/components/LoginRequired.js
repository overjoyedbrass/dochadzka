import React from 'react'
import { MessageBox } from './MessageBox'
import { useSelector } from 'react-redux'
import { selectLoggedBoolean, selectUserPerms } from '../features/auth/authSlice'

export const LoginRequired = ({permission, Component}) => {
    const isLogged = useSelector(selectLoggedBoolean)
    const perms = useSelector(selectUserPerms)

    if(!isLogged){
        return <MessageBox type="warning" message="Nie ste prihlásený"/>
    }

    if(permission && !perms.includes(permission)){
        return <MessageBox type="error" message="Nemáte dostatočné oprávnenia pre zobrazenie tejto stránky" />
    }
    return <Component />
}