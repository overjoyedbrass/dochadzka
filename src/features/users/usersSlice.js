import {
    createEntityAdapter,
    createSelector
  } from '@reduxjs/toolkit'
  
import { apiSlice } from '../api/apiSlice'


function compareUsersByName(u1, u2){
    const surnameCompare = u1.surname.localeCompare(u2.surname)
    return surnameCompare === 0 ? u1.name.localeCompare(u2.name) : surnameCompare
}

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            transformResponse: responseData => {
                responseData.sort(compareUsersByName)
                return usersAdapter.setAll(initialState, responseData)
            }
        })
    })
})
  
export const { useGetUsersQuery } = extendedApiSlice


export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()

export const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data
)

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)