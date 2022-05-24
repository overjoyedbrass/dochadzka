import { apiSlice } from './apiSlice.js'
import { parseISO, format } from 'date-fns'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTickets: builder.query({
            query: ({month, year, user_id}) => ({
                params: {month, year, user_id},
                url: `tickets`,
                method: 'GET',
            }),
            transformResponse: responseData => {
                let data = {}
                responseData.forEach(t => {
                    data[`${t.user_id}.${format(parseISO(t.from_date), "yyyy-MM-dd")}`] = { ...t }
                })
                return data
            },
            providesTags: ["Tickets"]
        }),
        printTicket: builder.mutation({
            query: (ticket) => ({
                url: 'tickets',
                method: "PUT",
                body: ticket
            }),
            invalidatesTags: ["Tickets"]
        })
    })
})

export const { 
    useGetTicketsQuery,
    usePrintTicketMutation,
} = extendedApiSlice