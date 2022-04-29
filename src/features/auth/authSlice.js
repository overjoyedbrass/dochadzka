import { createSlice } from '@reduxjs/toolkit'

import { apiSlice } from '../api/apiSlice.js'
import jwt_decode from 'jwt-decode'

function getInitialState() {
    try{
        const token = JSON.parse(localStorage.token).token
        const data = jwt_decode(token)
        return {
            token: token,
            user: data
        }
    }
    catch(err){
        return {token: null, user: null}
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            apiSlice.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                const data = jwt_decode(payload.token)
                state.user = data
                state.token = payload.token
            }
        )
        builder.addMatcher(
            apiSlice.endpoints.logout.matchFulfilled,
            (state, { payload }) => {
                localStorage.token = null
                state.user = {}
                state.token = ""
            }
        )
    },
})

export const { setCredentials } = authSlice.actions

export default authSlice.reducer

export const selectCurrentAuth = (state) => state.auth.token

export const selectLoggedUser = (state) => state.auth.user

export const selectLoggedBoolean = (state) => state.auth.token ? true : false