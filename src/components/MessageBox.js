import React from 'react'

import {
    GppMaybe,
    Warning
} from '@mui/icons-material'
import { red, orange } from '@mui/material/colors'


export const MessageBox = ({message="Dummy message", type="warning"}) => {
    const Icon = type === "error" ? GppMaybe : Warning
    const color = type === "error" ? red[400] : orange[400]

    return (
        <div style={{color: color}} className="message-box">
            <div className="icon"><Icon sx={{fontSize: "3em"}}/></div>
            <h3 style={{color: "black", margin: "0 1em"}}>{ message }</h3>
            <div className="emptyDiv" />
        </div>
        )
}