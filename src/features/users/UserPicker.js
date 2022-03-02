import React from 'react'

import { selectAllUsers } from './usersSlice'
import { selectCurrentUser, setCurrentUser } from './userSlice'
import { useSelector, useDispatch } from 'react-redux'
import {
    Select, MenuItem
} from '@mui/material'

export const UserPicker = () => {
    const userId = useSelector(selectCurrentUser)
    const users = useSelector(selectAllUsers)
    const dispatch = useDispatch()

    function onAuthorChanged(e){
        const id = e.target.value
        dispatch(setCurrentUser(id))
    }

    const usersOptions = users.map(user => (
        <MenuItem key={user.id} value={user.id}>
            <b>{user.name} {user.surname}</b>
        </MenuItem>
    ))

    return (
        <Select id="postAuthor" value={userId} onChange={onAuthorChanged}>
            <MenuItem value={""}>all users</MenuItem>
            {usersOptions}
        </Select>
    )
}