import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'

import { appTheme } from './helpers/themes.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@emotion/react';
import { AbsenceController } from './features/absences/AbsenceController.js';
import { Mainbar } from './components/Mainbar.js';
import { UserProfile } from './features/users/UserProfile.js';
import { UserManagment } from './features/users/UserManagment.js';
import { UserEdit } from './features/users/UserEdit.js';
import { EditDeadlines } from './features/deadlines/EditDeadlines.js';
import { Requests } from './features/absences/Requests';
import { Holidays } from './features/holidays/Holidays.js';
import { Budgets } from './features/holidays/Budgets.js';
import history from './app/history.js';
import { PasswordReset } from './features/auth/PasswordReset.js';
import NoPathMatch from './components/NoPathMatch'
import { LoginRequired } from "./components/LoginRequired";

function App() {
    return (          
        <ThemeProvider theme={appTheme}>
            <Router history={ history }>
                <Mainbar />            
                <div className="App">
                    <Routes>
                        <Route exact path="/" element={<AbsenceController/>}/>
                        <Route path="/profile" element = {<LoginRequired permission="" Component={UserProfile}/>}/>
                        <Route path="/users" element = {<LoginRequired permission="user_managment" Component={UserManagment}/>}/>
                        <Route path="/users/:id" element = {<LoginRequired permission="user_manamgnet" Component={UserEdit}/>}/>
                        <Route path="/deadlines" element = {<LoginRequired permission="edit_deadlines" Component={EditDeadlines}/>}/>/>
                        <Route path="/requests" element = {<LoginRequired permission="manage_requests" Component={Requests}/>}/>
                        <Route path="/holidays" element = {<LoginRequired permission="edit_holidays" Component={Holidays}/>}/>
                        <Route path="/budgets" element = {<LoginRequired permission="edit_budgets" Component={Budgets}/>}/>
                        <Route path="/resetpass" element = {<PasswordReset />} />
                        <Route path="*" element={<NoPathMatch />}
                        />
                    </Routes>
                    <ToastContainer position="top-center"/>
                </div>
            </Router>
        </ThemeProvider>   
  )
}

export default App