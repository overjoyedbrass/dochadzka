import React from 'react'
import { useSelector } from 'react-redux'
import { selectAllUsers, selectAllActiveUsers } from './usersSlice'
import { Select, MenuItem } from '@mui/material'

export const UserSelect = ({ selected, onChange, onlyActive }) => {
    const allUsers = useSelector(onlyActive ? selectAllActiveUsers : selectAllUsers)
    if (!allUsers.length) {
        return null
    }
    return (
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selected ? selected : ""}
                defaultValue={""}
                displayEmpty={true}
                onChange={(event) => onChange(event.target.value)}
                size="small"
                sx={{size:"fit-content"}}
            >
                <MenuItem
                    value=""
                >
                    Všetci
                </MenuItem>
            {
                allUsers.map(user => 
                    <MenuItem
                        key={user.id}
                        value={user.id}
                    >
                        {user.name} {user.surname}
                    </MenuItem>
                )
            }
            </Select>
    )
}