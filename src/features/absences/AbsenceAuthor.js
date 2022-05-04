import React from 'react'
//import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectUserById } from '../users/usersSlice'

export const AbsenceAuthor = ({userId, fullName}) => {
    const author = useSelector(state => selectUserById(state, userId))
    if(author){
        const firstName = fullName ? author.name : author.name[0] + "."
        return <span>{firstName} {author.surname}</span>
    }
    else{
        return <span>Unknown user</span>
    }
}