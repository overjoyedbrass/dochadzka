import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { selectLoggedBoolean } from '../features/auth/authSlice.js'
export const Navbar = () => {
    const loggedBoolean = useSelector(selectLoggedBoolean)

    return (
        <nav>
            <div className="navLinks">
                <NavLink 
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                    end to="/"
                > Neprítomnosti </NavLink>

                <NavLink 
                    to="/users"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Správa používateľov </NavLink>

                <NavLink 
                    to="/budgets"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Dovolenky </NavLink>

                <NavLink 
                    to="/deadlines"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Termíny </NavLink>

                <NavLink 
                    to="/holidays"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Voľné dni </NavLink>

                <NavLink 
                    to="/requests"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Žiadosti </NavLink>
            </div>
        </nav>
    )
}
