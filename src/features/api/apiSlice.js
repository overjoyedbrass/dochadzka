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
    tagTypes: ['Absence', "Holidays", "Deadlines", "Users", "UNAUTHORIZED"],
  

    endpoints: builder => ({
        getAbsenceTypes: builder.query({
            query: () => {
                return {
                    url: 'absence_types'
                }
            },
            transformResponse: responseData => {
                let data = {}
                responseData.forEach(atype => {
                    data[atype.type_id] = {key: atype.key, value: atype.name}
                })
                return data
            },
        }),
        ///////////////////////////////////
        // ABSENCES
        ///////////////////////////////////
        getAbsences: builder.query({
            query: ({year, month, userid, rq_only}) => {
                const params = { year, month, userid, rq_only }
                return {
                    url: 'absences',
                    params: params
                }
            },
            providesTags: (result, error, arg) =>
                result
                ? [...result.map(({ id }) => ({ type: 'Absence', id })), 'Absences', "UNAUTHORIZED"]
                : ['Absences', "UNAUTHORIZED"],
        }),

        getAbsence: builder.query({
            query: (id) => `absences/${id}`,
            providesTags: (result, error, id) => [{ type: 'Absence', id }, "UNAUTHORIZED"],
        }),
        insertAbsences: builder.mutation({
            query: (absences) => ({
                url: "absences",
                method: "POST",
                body: absences
            }),
            invalidatesTags: ["Absences", "Budget"]
        }),
        updateAbsence: builder.mutation({
            query: ({id, ...patch}) => ({
                url: `absences/${id}`,
                method: 'PATCH',
                body: patch
            }),
            invalidatesTags: ["Absences", "Budget"]
        }),

        confirmAbsence: builder.mutation({
            query: ({id, ...patch}) => ({
                url: `absences/${id}`,
                method: 'PATCH',
                body: patch
            }),
            async onQueryStarted(params, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAbsences', {year: params.year, rq_only: params.rq_only}, draft => {
                        const absence = draft.find(ab => ab.id === params.id)
                        if (absence) {
                            absence.confirmation = params.confirmation
                        }
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
              }
        }),
        deleteAbsence: builder.mutation({
            query: (id) => ({
                url: `absences/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["Absences", "Budget"]
        }),
        ///////////////////////////////////
        // DEADLINES
        ///////////////////////////////////
        getDeadlines: builder.query({
            query: (year) => {
                const params = { year }
                return {
                    url: 'deadlines',
                    params: params
                }
            },
            providesTags: ["Deadlines", "UNAUTHORIZED"]
        }),
        insertDeadlines: builder.mutation({
            query: ({year, ...data}) => ({
                url: "deadlines",
                params: { year },
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Deadlines"]
        }),

        ///////////////////////////////////
        // HOLIDAYS
        ///////////////////////////////////
        getHolidays: builder.query({
            query: (year) => {
                const params = { year }
                return {
                    url: 'holidays',
                    params: params
                }
            },
            providesTags: ['Holidays', "UNAUTHORIZED"],
        }),

        insertHoliday: builder.mutation({
            query: (data) => ({
                url: "holidays",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Holidays"]
        }),
        
        updateHoliday: builder.mutation({
            query: ({id, ...patch}) => ({
                url: `holidays/${id}`,
                method: "PATCH",
                body: patch
            }),
            invalidatesTags: ["Holidays"]
        }),

        deleteHoliday: builder.mutation({
            query: (id) => ({
                url: `holidays/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Holidays"]
        }),

        ///////////////////////////////////
        // budgets
        /////////////////////////////////// 
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
                    data[b.user_id] = { num: Math.round(b.num), used: Math.round(b.used) }
                })
                return data
            },
            providesTags: ["Budgets", "UNAUTHORIZED"]
        }),

        insertHolidaysBudget: builder.mutation({
            query: ({year, ...data}) => ({
                url: `holidays_budget?year=${year}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Budgets", "Budget"]
        }),

        getUserBudget: builder.query({
            query: (userId) => ({
                url: `holidays_budget/${userId}`,
                method: "GET"
            }),
            providesTags: ["Budget"]
        }),


        ///////////////////////////////////
        // PASSWORD RESET
        ///////////////////////////////////
        getResetToken: builder.mutation({
            query: (email) => ({
                url: "users/password",
                method: "PUT",
                body: { email: email }
            })
        }),

        resetPassword: builder.mutation({
            query: ({password, token, id}) => ({
                url: "resetpass",
                method: "PATCH",
                body: { newpass: password, token: token, id: id },
            })
        }),
    })
})

export const { 
    useGetAbsenceTypesQuery,
    useGetAbsencesQuery,
    useGetAbsenceQuery,
    useUpdateAbsenceMutation,
    useConfirmAbsenceMutation,
    useGetRequestsQuery,
    useInsertAbsencesMutation,
    useDeleteAbsenceMutation,

    useGetDeadlinesQuery,
    useInsertDeadlinesMutation,

    useGetHolidaysQuery,
    useInsertHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteHolidayMutation,

    useGetHolidaysBudgetQuery,
    useInsertHolidaysBudgetMutation,
    useGetUserBudgetQuery,
    

    useGetResetTokenMutation,
    useResetPasswordMutation,

} = apiSlice