import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { selectLoggedBoolean, selectUserPerms } from '../features/auth/authSlice.js'
export const Navbar = () => {
    const perms = useSelector(selectUserPerms)
    return (
        <nav>
            <div className="navLinks">
                <NavLink 
                    end to="/"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Neprítomnosti </NavLink>
                { perms.user_managment ? 
                <NavLink 
                    to="/users"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Správa používateľov </NavLink> : null}

                { perms.edit_budgets ? 
                <NavLink 
                    to="/budgets"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Dovolenky </NavLink> : null }

                { perms.edit_deadlines ?
                <NavLink 
                    to="/deadlines"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Termíny </NavLink> : null }

                { perms.edit_holidays ?
                <NavLink 
                    to="/holidays"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Voľné dni </NavLink> : null }

                { perms.manage_requests ? 
                <NavLink 
                    to="/requests"
                    className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
                > Žiadosti </NavLink> : null }
            </div>
        </nav>
    )
}
