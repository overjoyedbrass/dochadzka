import React from 'react'
import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersSlice'
import { FormControl, Select, MenuItem, IconButton } from '@mui/material'
import { Clear } from '@mui/icons-material'

export const UserSelect = ({ selected, onChange }) => {
    const allUsers = useSelector(selectAllUsers)
    return (
        <FormControl
            sx={{display: "inline-block"}}
        >
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selected ? selected : ""}
                onChange={(event) => onChange(event.target.value)}
                size="small"
            >
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
            {selected ? <IconButton aria-label="clear" style={{display: "inline-block"}} onClick={() => onChange("")}><Clear /></IconButton> : null}
        </FormControl>
    )
}