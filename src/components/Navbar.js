import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { selectUserPerms } from '../features/auth/authSlice.js'
export const Navbar = () => {
    const perms = useSelector(selectUserPerms)
    const hasPerm = (key) => perms.includes(key)
    return (
        <nav>
            <div className="navLinks">
                <NavLink 
                    end to="/"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Neprítomnosti </NavLink>
                { hasPerm("user_managment") ? 
                <NavLink 
                    to="/users"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Správa používateľov </NavLink> : null}

                { hasPerm("edit_budgets") ? 
                <NavLink 
                    to="/budgets"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Dovolenky </NavLink> : null }

                { hasPerm("edit_deadlines") ?
                <NavLink 
                    to="/deadlines"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Termíny </NavLink> : null }

                { hasPerm("edit_holidays") ?
                <NavLink 
                    to="/holidays"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Voľné dni </NavLink> : null }

                { hasPerm("manage_requests") ? 
                <NavLink 
                    to="/requests"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Žiadosti </NavLink> : null }
            </div>
        </nav>
    )
}
