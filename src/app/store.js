import { configureStore } from '@reduxjs/toolkit'

import { apiSlice } from '../features/api/apiSlice.js'
import authReducer from '../features/auth/authSlice.js'

export default configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)
})
