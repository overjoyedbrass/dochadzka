import React from 'react'

import { Flight as FlightIcon } from '@mui/icons-material'
import { selectLoggedUser } from '../auth/authSlice'
import { useGetUserBudgetQuery } from '../api/budgetSlice'
import { useSelector } from 'react-redux'


export const ShowBudget = () => {
    const user = useSelector(selectLoggedUser)
    const user_id = user.id
    const { data={} } = useGetUserBudgetQuery(user_id)
    return (
        <div className="budget-info" style={{color: "white"}}>
            {"num" in data ? 
            <>{data.num - data.used ?? 0}/{Math.round(data.num) ?? 0} &nbsp; <FlightIcon /></> :
            <>Neurčené &nbsp;<FlightIcon /></> }
        </div>
    )
}