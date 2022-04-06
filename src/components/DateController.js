import React from 'react'
import {sub, add} from 'date-fns'
import {
    Button
} from '@mui/material'
import { displaySelectedMonth } from '../helpers/helpers.js'

export const DateController = ({viewDate, onChange, type="month", button=true}) => {
    const subYear = () => onChange(sub(viewDate, {years: 1}))
    const addYear = () => onChange(add(viewDate, {years: 1}))
    const subMonth = () => onChange(sub(viewDate, {months: 1}))
    const addMonth = () => onChange(add(viewDate, {months: 1}))

    const type_int = type === "month"
    const today = new Date()
        
    return (
        <div className="date-controller">
            <Button onClick={type_int ? subMonth : subYear}>{"<"}</Button>
            <b>{type_int ? displaySelectedMonth(viewDate) : viewDate.getFullYear()}</b>
            <Button onClick={type_int ? addMonth : addYear}>{">"}</Button>
            {button ? <Button variant="outlined" onClick={() => onChange(new Date())}>
                Dnes
            </Button> : null }
        </div>
        )
}