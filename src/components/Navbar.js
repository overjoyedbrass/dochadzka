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
                {loggedBoolean ? <Link to="/profile">Profil</Link> : null }
                {loggedBoolean ? <Link to="/usermanagment">Správa používateľov</Link> : null }
                {loggedBoolean ? <Link to="/deadlines">Termíny</Link> : null }
                {loggedBoolean ? <Link to="/holidays">Voľné dni</Link> : null }
                {loggedBoolean ? <Link to="/btrips">Pracovné cesty</Link> : null }
            </div>
        </nav>
    )
}
