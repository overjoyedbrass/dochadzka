import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom'

import { Navbar } from './app/Navbar'
import { AbsencesList } from './features/absences/AbsencesList.js'
import { CalendarWithPicker } from './features/absences/Calendar.js'

function App() {
  return (             
        <Router>
        <Navbar />
        <div className="App">
        <Routes>
            <Route exact path="/" element = {<AbsencesList />} />
            <Route exact path="/calendar" element = {<CalendarWithPicker />} />
        </Routes>
        </div>
    </Router>
  )
}

export default App