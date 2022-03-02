import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/'}),
    tagTypes: ['Absence'],
    endpoints: builder => ({
        getAbsences: builder.query({
            query: ({year, month, userid}) => {
                const params = { year, month, userid }
                return {
                    url: 'absences',
                    params: params
                }
            }
        }),
    })
})

export const { 
    useGetAbsencesQuery
} = apiSlice