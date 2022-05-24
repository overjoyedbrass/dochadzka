import { apiSlice } from './apiSlice.js'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
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
        })
    })
})

export const {
    useGetDeadlinesQuery,
    useInsertDeadlinesMutation
} = extendedApiSlice