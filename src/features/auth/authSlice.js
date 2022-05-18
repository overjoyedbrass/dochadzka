import { createSlice } from '@reduxjs/toolkit'

import { apiSlice } from '../api/apiSlice.js'
import jwt_decode from 'jwt-decode'
import { toast } from 'react-toastify'
import history from '../../app/history'


const emptyUser = { perms: [] }

function getInitialState() {
    try{
        const token = JSON.parse(localStorage.token).token
        const data = jwt_decode(token)
        return {
            token: token,
            user: data ? data : emptyUser
        }
    }
    catch(err){
        return {token: null, user: null}
    }
}

function anyQueryRejected(){
    for(const name in apiSlice.endpoints){
        if(apiSlice.endpoints[name].matchRejected){
            return true
        }
    }
    return false
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
                state.user = emptyUser
                state.token = ""
            }
        )
        builder.addMatcher(
            anyQueryRejected,
            (state, { payload }) => {
                if(payload?.data?.code === "unauthorized") return;
                if(payload && payload.status === 401){
                    toast("Prihlásenie vypršalo", {type: "error", onClose: () => window.location.replace("/")})
                    localStorage.token = null
                    state.user = emptyUser
                    state.token = null
                    history.push("/")
                }
            }
        )
    },
})


export const { setCredentials } = authSlice.actions

export default authSlice.reducer

export const selectCurrentAuth = (state) => state.auth.token

export const selectLoggedUser = (state) => state.auth.user

export const selectLoggedBoolean = (state) => Boolean(state.auth.token)

export const selectUserPerms = (state) => state.auth.user?.perms ?? []