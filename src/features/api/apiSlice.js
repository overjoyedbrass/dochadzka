import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../config'
// Define our single API slice object
export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ 
        baseUrl: BASE_URL,
        
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = getState().auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['Absence', "Holidays", "Deadlines", "Users", "UNAUTHORIZED", "Tickets", "Budget", "Budgets"],
  

    endpoints: builder => ({
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
    useGetResetTokenMutation,
    useResetPasswordMutation,
} = apiSlice