import { apiSlice } from './apiSlice.js'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAbsenceTypes: builder.query({
            query: () => {
                return {
                    url: 'absence_types'
                }
            },
            transformResponse: responseData => {
                let data = {}
                responseData.forEach(ab_type => {
                    data[ab_type.type_id] = {key: ab_type.key, value: ab_type.name}
                })
                return data
            },
        }),
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
                body: {id: patch.id, confirmation: patch.confirmation}
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
    useDeleteAbsenceMutation
} = extendedApiSlice