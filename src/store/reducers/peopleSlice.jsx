import { createSlice } from "@reduxjs/toolkit";

const peopleSlice = createSlice({ 
    name: "people",
    initialState: {
        info: null,
    },
    reducers: {
        loadPeople: (state, action) => {
            state.info = action.payload;
        },
        removePeople: (state, action) => {
            state.info = null;
        },
    },
 });

export const {loadPeople,removePeople} = peopleSlice.actions;
export default peopleSlice.reducer;