import { apiSlice } from '../../features/api/apiSlice'

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

export const { 
    useLoginMutation,
    useLogoutMutation,
} = extendedApiSlice