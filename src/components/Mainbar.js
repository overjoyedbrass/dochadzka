import React from 'react'
import { Login } from '../features/auth/Login.js'
import { Navbar } from  './Navbar.js'
import './Mainbar.css'
import { ImpersonateUser } from '../features/users/ImpersonateUser.js'
export const Mainbar = () => {
    return (
        <header>
            <div className="wrapper">
                <div className="content">
                    <h1>prítomnosť na pracovisku</h1>
                    <h3>katedra aplikovanej informatiky</h3>
                </div>
                <Login />
            </div>
            <Navbar />
            <ImpersonateUser />
        </header>
    )
}