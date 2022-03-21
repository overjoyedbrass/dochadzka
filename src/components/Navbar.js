import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectLoggedBoolean } from '../features/auth/authSlice.js'
export const Navbar = () => {
    const loggedBoolean = useSelector(selectLoggedBoolean)

    return (
        <nav>
            <div className="navLinks">
                <Link to="/">Neprítomnosti</Link>
                <Link to="/calendar">Kalendár</Link>
                {loggedBoolean ? <Link to="/profile">Profil</Link> : null }
            </div>
        </nav>
    )
}
