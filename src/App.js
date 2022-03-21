import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom'

// toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';
// import 'react-toastify/dist/ReactToastify.css';

import { AbsencesList } from './features/absences/AbsencesList.js'

import { CalendarController } from './features/absences/CalendarController.js'
import { Mainbar } from './components/Mainbar.js'

function App() {
  return (             
        <Router>
            <Mainbar />            
        <div className="App">
            <Routes>
                <Route exact path="/" element = {<AbsencesList />} />
                <Route exact path="/calendar" element = {<CalendarController />} />
            </Routes>
            <ToastContainer 
                position="top-center"
            />
        </div>
    </Router>
  )
}

export default App