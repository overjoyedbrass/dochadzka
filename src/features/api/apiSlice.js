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
        // ABSENCES
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
        // DEADLINES
        getDeadlines: builder.query({
            query: (year) => {
                const params = { year }
                return {
                    url: 'deadlines',
                    params: params
                }
            }
        }),
        insertDeadlines: builder.query({
            query: (data) => ({
                url: "deadlines",
                method: "POST",
                body: data
            })
        }),

        // HOLIDAYS

        getHolidays: builder.query({
            query: (year) => {
                const params = { year }
                return {
                    url: 'holidays',
                    params: params
                }
            }
        }),

        insertHolidays: builder.query({
            query: (data) => ({
                url: "holidays",
                method: "POST",
                body: data
            })
        }),

        // budgets

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
        }),

        insertHolidaysBudget: builder.query({
            query: (data) => ({
                url: "holidays_budget",
                method: "POST",
                body: data
            })
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