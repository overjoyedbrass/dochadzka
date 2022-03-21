import React from 'react'
import {sub, add} from 'date-fns'
import {
    Button
} from '@mui/material'
import { displaySelectedMonth } from '../helpers/helpers.js'

export const DateController = ({viewDate, onChange}) => {

    const subMonth = () => {
        onChange(sub(viewDate, {months: 1}))
    }
    const addMonth = () => {
        onChange(add(viewDate, {months: 1}))
    }

    return (
        <div className="date-controller">
            <Button variant="outlined" onClick={() => onChange(new Date())}>Dnes</Button>
            <Button onClick={subMonth}>{"<"}</Button>
            <b>{displaySelectedMonth(viewDate)}</b>
            <Button onClick={addMonth}>{">"}</Button>
        </div>
    )
}