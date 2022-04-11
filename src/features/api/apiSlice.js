import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:8080/api/',
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = getState().auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
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
        getRequests: builder.query({
            query: (year) => {
                const params = { year, request: 1 }
                return {
                    url: 'absences',
                    params: params
                }
            }
        }),
        updateAbsences: builder.mutation({
            query: ({data}) => ({
                url: 'absences',
                method: 'POST',
                body: data
            })
        }),
        getDeadlines: builder.query({
            query: (year) => {
                const params = { year }
                return {
                    url: 'deadlines',
                    params: params
                }
            }
        }),
        getHolidays: builder.query({
            query: (year) => {
                const params = { year }
                return {
                    url: 'holidays',
                    params: params
                }
            }
        }),
        getHolidaysBudget: builder.query({
            query: (year) => {
                const params = { year }
                return {
                    url: 'holidays_budget',
                    params: params
                }
            },
            transformResponse: responseData => {
                let data = {}
                responseData.forEach(b => {
                    data[b.user_id] = Math.round(b.num)
                })
                return data
            }
        })
    })
})

export const { 
    useGetAbsencesQuery,
    useUpdateAbsencesMutation,
    useGetRequestsQuery,
    useGetDeadlinesQuery,
    useGetHolidaysQuery,
    useGetHolidaysBudgetQuery
} = apiSlice