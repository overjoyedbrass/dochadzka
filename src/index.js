import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { apiSlice } from './features/api/apiSlice'
import { extendedApiSlice } from './features/users/usersSlice'

store.dispatch(extendedApiSlice.endpoints.getUsers.initiate())
store.dispatch(apiSlice.endpoints.getAbsenceTypes.initiate())

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById('root')
)
