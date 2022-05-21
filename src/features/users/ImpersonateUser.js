import { MenuItem, Select, Button } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectImpersonatedUser, setImpersonate } from '../auth/authSlice'
import { appTheme } from '../../helpers/themes'
import { selectAllActiveUsers } from './usersSlice'

export const ImpersonateUser = () => {
    const impersonatedUser = useSelector(selectImpersonatedUser)
    const users = useSelector( selectAllActiveUsers )
    const dispatch = useDispatch()

    if(!impersonatedUser){
        return null
    }

    return (
        <div className="impersonate-bar" style={{
            background: appTheme.palette.primary.main,
            color: "white"
        }}>
            Zadaváte neprítomnosť v mene: &nbsp;
            <Select 
                size="small" 
                sx={{ fontSize: ".75em", color: "white" }}
                // onChange={(e) => dispatch(setImpersonate(e.target.value))}
                value={impersonatedUser}
                defaultValue={0}
            >
                <MenuItem style={{color: "orange", background: "black"}}value={0} onClick={() => dispatch(setImpersonate(0))}>Vypnúť</MenuItem>
                { users.map(u => 
                    <MenuItem 
                        key={u.id} 
                        value={u.id}
                        onClick={() => dispatch(setImpersonate(u.id))}
                    >
                        {u.name} {u.surname}
                    </MenuItem>
                )}   
            </Select>&nbsp;
            <Button size="small" color="warning" variant="contained" onClick={() => dispatch(setImpersonate(0))}>Vypnúť</Button>
        </div>
    )
}