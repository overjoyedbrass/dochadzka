import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom'

// toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { AbsenceController } from './features/absences/AbsenceController.js'
import { Mainbar } from './components/Mainbar.js'
import { UserProfile } from './features/users/UserProfile.js';
import { UserManagment } from './features/users/UserManagment.js';
import { UserEdit } from './features/users/UserEdit.js';
import { EditDeadlines } from './features/deadlines/EditDeadlines.js';
import { Requests } from './features/absences/Requests';
import { Holidays } from './features/holidays/Holidays.js';
import { Budgets } from './features/holidays/Budgets.js';

function App() {
  return (             
        <Router>
            <Mainbar />            
        <div className="App">
            <Routes>
                <Route exact path="/" element = {<AbsenceController />} />
                <Route path="/profile" element = {<UserProfile />} />
                <Route path="/users" element = {<UserManagment />} />
                <Route path="/users/:id" element = {<UserEdit />} />
                <Route path="/deadlines" element = {<EditDeadlines />} />
                <Route path="/requests" element = {<Requests />} />
                <Route path="/holidays" element = {<Holidays />} />
                <Route path="/budgets" element = {<Budgets />} />
            </Routes>
            <ToastContainer 
                position="top-center"
            />
        </div>
    </Router>
  )
}

export default App