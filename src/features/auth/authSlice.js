import { createSlice } from '@reduxjs/toolkit'

import { apiSlice } from '../api/apiSlice.js'
import jwt_decode from 'jwt-decode'
import { toast } from 'react-toastify'
import history from '../../app/history'


export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ["UNAUTHORIZED"]
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'logout'
            }),
            invalidatesTags: ["UNAUTHORIZED"]
        })
    })
})

const emptyUser = { perms: [] }

function getInitialState() {
    try{
        const token = JSON.parse(localStorage.token).token
        const data = jwt_decode(token)
        return {
            token: token,
            user: data ? data : emptyUser,
            impersonate: 0
        }
    }
    catch(err){
        return {token: null, user: emptyUser, impersonate: 0}
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
    reducers: {
        setImpersonate: (state, { payload }) => {
            state.impersonate = payload
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            apiSlice.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                const data = jwt_decode(payload.token)
                state.user = data
                state.token = payload.token
                localStorage.token = JSON.stringify(payload)
                state.impersonate = 0
            }
        )
        builder.addMatcher(
            apiSlice.endpoints.logout.matchFulfilled,
            (state, { _payload }) => {
                localStorage.token = null
                state.user = emptyUser
                state.token = ""
                state.impersonate = 0
            }
        )
        builder.addMatcher(
            anyQueryRejected,
            (state, { payload }) => {
                if(payload?.data?.code === "unauthorized") return;
                if(payload && payload.status === 401){
                    console.log("ERR CODE", payload.data?.code)
                    toast("Platnosť tokenu vypršala", {type: "error", onClose: () => window.location.replace("/")})
                    localStorage.token = null
                    state.user = emptyUser
                    state.token = null
                    state.impersonate = 0
                    history.push("/")
                }
            }
        )
    },
})
export const { setImpersonate } = authSlice.actions

export default authSlice.reducer

export const selectImpersonatedUser = (state) => state.auth.impersonate

export const selectCurrentAuth = (state) => state.auth.token

export const selectLoggedUser = (state) => state.auth.user

export const selectLoggedBoolean = (state) => Boolean(state?.auth?.token)

export const selectUserPerms = (state) => state.auth.user?.perms ?? []

export const { 
    useLoginMutation,
    useLogoutMutation,
} = extendedApiSlice