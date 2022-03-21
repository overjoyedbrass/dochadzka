import React from 'react'
import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersSlice'
import './UserList.css'

import { Button } from '@mui/material'

export const UserList = ({selected, onSelect}) => {
    const users = useSelector(selectAllUsers)
    users.sort((u1, u2) => {
        const result = u1.name.localeCompare(u2.name)
        return result !== 0 ? result : u1.surname.localeCompare(u2.surname)
    })

    return (
        <div className="user-list">
            <h3>Prehľad zamestnancov</h3>

            { selected ? 
            <Button
                onClick={() => onSelect("")}
            >
                Zrušiť výber
            </Button> : null}   

            <div className="user-wrapper">
                { users.map(u => 
                    <div 
                        key={u.id} 
                        className={`row ${u.id === selected ? "selected" : ""}`} 
                        onClick={() => onSelect(u.id === selected ? "" : u.id)}
                    >
                        {u.name} {u.surname}
                    </div>
                )}
            </div>
        </div>)
}