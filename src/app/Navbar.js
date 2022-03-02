import React from 'react'
import { Link } from 'react-router-dom'
import { UserPicker } from '../features/users/UserPicker.js'

export const Navbar = () => {
    return (
        <nav>
            <section>
                <h1>Aplikácia dochádzky</h1>
                <div className="navContent">
                    <div className="navLinks">
                        <Link to="/">Neprítomnosti</Link>
                        <Link to="/calendar">Kalendár</Link>
                        <UserPicker />
                    </div>
                </div>
            </section>
        </nav>
    )
}
