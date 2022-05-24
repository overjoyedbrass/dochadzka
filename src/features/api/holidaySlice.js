import { apiSlice } from './apiSlice.js'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
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
    })
})

export const { 
    useGetHolidaysQuery,
    useInsertHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteHolidayMutation,
} = extendedApiSlice