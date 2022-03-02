import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'


import { apiSlice } from '../features/api/apiSlice.js'
import userReducer from '../features/users/userSlice.js'
export default configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      user: userReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)
})
