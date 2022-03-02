import React from 'react'
//import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectUserById } from '../users/usersSlice'

export const AbsenceAuthor = ({userId}) => {
    const author = useSelector(state => selectUserById(state, userId))
    if(author){
        return <span>{author.name[0]}. {author.surname}</span>
    }
    else{
        return <span>Unknown user</span>
    }
}