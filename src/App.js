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

function App() {
  return (             
        <Router>
            <Mainbar />            
        <div className="App">
            <Routes>
                <Route exact path="/" element = {<AbsenceController />} />
                <Route exact path="/profile" element = {<UserProfile />} />
                <Route exact path="/usermanagment" element = {<UserManagment />} />
            </Routes>
            <ToastContainer 
                position="top-center"
            />
        </div>
    </Router>
  )
}

export default App