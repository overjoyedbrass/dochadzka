import React from 'react'
import { formatFromTo } from "../../helpers/helpers.js"
import { AbsenceAuthor } from './AbsenceAuthor.js'
import { mainTheme } from '../../helpers/themes.js'

export const AbsenceCell = ({ab, fun}) => {
    return (
    <p style={{fontSize:"1em", cursor:"pointer"}} onClick={() => fun(ab) }>
        <span className="absence-box" style={{background: mainTheme.palette.primary.light}}>
            <AbsenceAuthor userId={ab.user_id}/> {formatFromTo(ab.from_time, ab.to_time)}
        </span>
    </p>
    )
}