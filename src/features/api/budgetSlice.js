import { apiSlice } from '../api/apiSlice.js'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
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
    })
})

export const { 
    useGetHolidaysBudgetQuery,
    useInsertHolidaysBudgetMutation,
    useGetUserBudgetQuery,
} = extendedApiSlice