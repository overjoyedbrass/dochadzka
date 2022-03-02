import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: ""
    },
    reducers: {
        setCurrentUser: (state, action) => {
			state.id = action.payload
        }
    },
})
export const { setCurrentUser } = userSlice.actions

export const selectCurrentUser = state => state.user.id;
export default userSlice.reducer