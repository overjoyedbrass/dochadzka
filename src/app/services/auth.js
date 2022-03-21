import { apiSlice } from '../../features/api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
        })
    })
})

export const { useLoginMutation } = extendedApiSlice