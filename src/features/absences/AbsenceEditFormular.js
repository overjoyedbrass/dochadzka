import React from 'react'
import { formatFromTo } from '../../helpers/helpers.js'

export const AbsenceEditFormular = ({ab}) => {
    if(!ab) return null
    return (
        <>
            <p>Nepritomnosť v čase: {formatFromTo(ab.from_time, ab.to_time)}</p>
            <p>Typ neprítomnosti: {ab.type}</p>
            <p>Popis: {ab.description}</p>
        </>
    )
}